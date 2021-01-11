import React from 'react';
import ReadMoreReact from 'read-more-react';
import path from 'path';
import url from 'url';
import axios from 'axios';
import {parse as WktParser} from 'wellknown';
import {Parser as N3Parser} from 'n3';

export async function getHttpData(_url:string){
  const _path = url.parse(_url).path || "";
  let ext = path.extname(_path);
  if (path.basename(_path).length === 0) {
    _url += "index";
  }
  try {
    const res:any = await axios.get(_url,{
      headers: (ext.length!==0 ? {} : { Accept: "text/turtle" })
    });
    if (!res.data) return;
    else if (typeof res.data === "string") {
      //let text = res.data.replace(/\\u([\d\w]{4})/gi,
      //  (match:string, grp:string)=>String.fromCharCode(parseInt(grp, 16)));
      return convObjectFromTurtle(res.data);
    } else {
      return res.data;
    }
  } catch (e) {
    console.error(e);
  }
}

export function getGeoJsonFromWkt(wkt:string) {
  let obj = WktParser(wkt);
  const json = {
    properties: {},
    type: 'Feature' as const,
    geometry: {...obj}
  };
  return json;
}

export function getLink(text:string) {
  if (text.match(new RegExp("^https?://.+?.(jpg|jpeg|gif|png)$","i"))) {
    return (
      <a href={ text } target="_blank" rel="noreferrer noopener">
        <img src={ text } alt={ path.basename(text) } />
      </a>
    );
  } else if (text.match(new RegExp("^https?://.+$","i")) || text.match(new RegExp("^mailto:.+$"))) {
    const urlObj = url.parse(text);
    const hostname = urlObj.hostname;
    let link = text;
    let target = "_blank";
    if (hostname === (window as any).location.hostname) {
      target = '_self';
      link = urlObj.path || text;
    }
    return (
      <a href={ link } target={target} rel="noreferrer noopener">
        { shorten(text) }
      </a>);
  }
  if (Number(text)) text = ""+Number(text);
  return (<ReadMoreReact text={ text } />)
}

export function shorten(uri:any, prefixes:any=null){
  const ns = (window as any).namespaces || namespaces;
  if (!prefixes) prefixes = ns;
  // if (!prefixes) return uri;
  let parts:any = splitUri(uri,prefixes);
  if (parts) {
    return `${parts[0]}:${parts[1]}`
  }
  return uri;
}

function splitUri(uri:string, prefixes:any) {
  if (!uri || uri === '')
    return uri;
  for (const prefix of Object.keys(prefixes)){
    const long = prefixes[prefix];
    if (uri.substr(0, long.length)!==long)
      continue;
    const local_part = uri.substr(long.length);
    if (local_part.indexOf('/') >= 0)
      continue;
    return [prefix, local_part];
  };
}

function convObjectFromTurtle(ttl:string) {
  const triples = (new N3Parser()).parse(ttl);
  const rdfs:any = {}
  let blanks = triples.filter(f=>f.subject.termType === "BlankNode");
  const nodes = triples.filter(f=>f.subject.termType !== "BlankNode");
  for (const s of nodes) {
    rdfs[s.subject.value] = rdfs[s.subject.value] || {}
    const obj = rdfs[s.subject.value][s.predicate.value] || [];
    if (s.object.termType === "BlankNode") {
      const bn = blanks.filter(f=>f.subject.id === s.object.id);
      for (const b of bn) {
        const _rdf:any = {};
        _rdf[b.predicate.value] = [b.object];
        _rdf.termType = s.object.termType;
        obj.push(_rdf);
      }
      blanks = blanks.filter(f=>f.subject.id !== s.object.id);
    } else {
      obj.push(s.object);
    }
    rdfs[s.subject.value][s.predicate.value] = obj;
  }
  for (const s of blanks) {
    rdfs[s.subject.value] = rdfs[s.subject.value] || {}
    rdfs[s.subject.value][s.predicate.value] = rdfs[s.subject.value][s.predicate.value] || [];
    rdfs[s.subject.value][s.predicate.value] = [s.object];
  }
  return rdfs;
}

const namespaces = {
  "bibo": "http://purl.org/ontology/bibo/",
  "cc": "http://creativecommons.org/ns#",
  "cert": "http://www.w3.org/ns/auth/cert#",
  "ctag": "http://commontag.org/ns#",
  "dc": "http://purl.org/dc/terms/",
  "dc11": "http://purl.org/dc/elements/1.1/",
  "dcat": "http://www.w3.org/ns/dcat#",
  "dcterms": "http://purl.org/dc/terms/",
  "doap": "http://usefulinc.com/ns/doap#",
  "exif": "http://www.w3.org/2003/12/exif/ns#",
  "foaf": "http://xmlns.com/foaf/0.1/",
  "geo": "http://www.w3.org/2003/01/geo/wgs84_pos#",
  "gr": "http://purl.org/goodrelations/v1#",
  "grddl": "http://www.w3.org/2003/g/data-view#",
  "ical": "http://www.w3.org/2002/12/cal/icaltzd#",
  "ma": "http://www.w3.org/ns/ma-ont#",
  "og": "http://ogp.me/ns#",
  "org": "http://www.w3.org/ns/org#",
  "owl": "http://www.w3.org/2002/07/owl#",
  "prov": "http://www.w3.org/ns/prov#",
  "qb": "http://purl.org/linked-data/cube#",
  "rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
  "rdfa": "http://www.w3.org/ns/rdfa#",
  "rdfs": "http://www.w3.org/2000/01/rdf-schema#",
  "rev": "http://purl.org/stuff/rev#",
  "rif": "http://www.w3.org/2007/rif#",
  "rr": "http://www.w3.org/ns/r2rml#",
  "rss": "http://purl.org/rss/1.0/",
  "schema": "http://schema.org/",
  "sd": "http://www.w3.org/ns/sparql-service-description#",
  "sioc": "http://rdfs.org/sioc/ns#",
  "skos": "http://www.w3.org/2004/02/skos/core#",
  "skosxl": "http://www.w3.org/2008/05/skos-xl#",
  "synd": "http://purl.org/rss/1.0/modules/syndication/",
  "v": "http://rdf.data-vocabulary.org/#",
  "vcard": "http://www.w3.org/2006/vcard/ns#",
  "void": "http://rdfs.org/ns/void#",
  "wdr": "http://www.w3.org/2007/05/powder#",
  "wdrs": "http://www.w3.org/2007/05/powder-s#",
  "wot": "http://xmlns.com/wot/0.1/",
  "xhv": "http://www.w3.org/1999/xhtml/vocab#",
  "xml": "http://www.w3.org/XML/1998/namespace",
  "xsd": "http://www.w3.org/2001/XMLSchema#",
  "ic": "http://imi.go.jp/ns/core/rdf#",
  "ic22": "http://imi.ipa.go.jp/ns/core/rdf#",
  "gn": "http://www.geonames.org/ontology#",
  "gsp": "http://www.opengis.net/ont/geosparql#",
  "wdt": "http://www.wikidata.org/prop/direct/",
  "dbpediaowl": "http://dbpedia.org/ontology/",
  "propja": "http://ja.dbpedia.org/property/",
}