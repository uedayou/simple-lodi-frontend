import React from "react";
import ReadMoreReact from "read-more-react";
import path from "path";
import url from "url";
import axios from "axios";
import { parse as WktParser } from "wellknown";
import { Parser as N3Parser } from "n3";
import { DEBUG_MODE, DEBUG_REPLACE_URL, DEBUG_REPLACE_HOSTNAME } from "../conf";
import namespaces from "./namespaces";

// デバッグ用
export function convUrlInDebug(_url: string, replacement?: string) {
  replacement =
    replacement ||
    DEBUG_REPLACE_HOSTNAME ||
    `http://${window.location.hostname}:${window.location.port}/`;
  if (DEBUG_MODE) {
    if (_url.match(replacement)) {
      _url = _url.replace(replacement, DEBUG_REPLACE_URL);
    } else {
      _url = _url.replace(DEBUG_REPLACE_URL, replacement);
    }
  }
  return _url;
}

export async function getHttpData(
  _url: string,
  acceptType: string = "text/turtle"
) {
  // acceptType = "application/json";
  const _path = url.parse(_url).path || "";
  let ext = path.extname(_path);
  if (path.basename(_path).length === 0) {
    _url += "index";
  }
  try {
    const res = await axios.get(`${_url}?timestamp=${new Date().getTime()}`, {
      headers: ext.length !== 0 ? {} : { Accept: acceptType },
    });
    if (!res.data) return;
    else if (typeof res.data === "string") {
      //let text = res.data.replace(/\\u([\d\w]{4})/gi,
      //  (match:string, grp:string)=>String.fromCharCode(parseInt(grp, 16)));
      return acceptType.match(/turtle/)
        ? convObjectFromTurtle(res.data)
        : convObjectFromJson(JSON.parse(res.data));
    } else {
      return convObjectFromJson(res.data);
    }
  } catch (e) {
    console.error(e);
  }
}

export function getGeoJsonFromWkt(wkt: string, name?: string, uri?: string) {
  let obj = WktParser(wkt);
  let properties = {};
  if (name && uri) {
    properties = { name, uri };
  }
  const json = {
    properties,
    type: "Feature" as const,
    geometry: { ...obj },
  };
  return json;
}

export function getLink(text: string) {
  if (!text) return;
  if (text.match(new RegExp("^https?://.+?.(jpg|jpeg|gif|png)$", "i"))) {
    return (
      <a href={text} target="_blank" rel="noreferrer noopener">
        <img src={text} alt={path.basename(text)} />
      </a>
    );
  } else if (
    text.match(new RegExp("^https?://.+$", "i")) ||
    text.match(new RegExp("^mailto:.+$"))
  ) {
    text = convUrlInDebug(text);
    const urlObj = url.parse(text);
    const hostname = urlObj.hostname;
    let link = text;
    let target = "_blank";
    if (hostname === (window as any).location.hostname) {
      target = "_self";
      link = urlObj.path || text;
    }
    return (
      <a href={link} target={target} rel="noreferrer noopener">
        {shorten(text)}
      </a>
    );
  }
  if (Number(text)) text = "" + Number(text);
  return <ReadMoreReact text={text} />;
}

export function shorten(uri: string, prefixes?: { [key: string]: string }) {
  const ns = (window as any).namespaces || namespaces;
  const _prefs = prefixes || ns;
  // if (!prefixes) return uri;
  const parts = splitUri(uri, _prefs);
  if (parts) {
    return `${parts[0]}:${parts[1]}`;
  }
  return uri;
}

function splitUri(uri: string, prefixes: { [key: string]: string }) {
  if (!uri || uri === "") return uri;
  for (const prefix of Object.keys(prefixes)) {
    const long = prefixes[prefix];
    if (uri.substr(0, long.length) !== long) continue;
    const local_part = uri.substr(long.length);
    if (local_part.indexOf("/") >= 0) continue;
    return [prefix, local_part];
  }
}

function convObjectFromTurtle(ttl: string) {
  const triples = new N3Parser().parse(ttl);
  const rdfs: any = {};
  let blanks = triples.filter((f) => f.subject.termType === "BlankNode");
  const nodes = triples.filter((f) => f.subject.termType !== "BlankNode");
  for (const s of nodes) {
    rdfs[s.subject.value] = rdfs[s.subject.value] || {};
    const obj = rdfs[s.subject.value][s.predicate.value] || [];
    if (s.object.termType === "BlankNode") {
      const bn = blanks.filter((f) => f.subject.id === s.object.id);
      for (const b of bn) {
        const _rdf: any = {};
        _rdf[b.predicate.value] = [b.object];
        _rdf.termType = s.object.termType;
        obj.push(_rdf);
      }
      blanks = blanks.filter((f) => f.subject.id !== s.object.id);
    } else {
      obj.push(s.object);
    }
    rdfs[s.subject.value][s.predicate.value] = obj;
  }
  for (const s of blanks) {
    rdfs[s.subject.value] = rdfs[s.subject.value] || {};
    rdfs[s.subject.value][s.predicate.value] =
      rdfs[s.subject.value][s.predicate.value] || [];
    rdfs[s.subject.value][s.predicate.value] = [s.object];
  }
  return rdfs;
}

function convObjectFromJson(json: any) {
  for (const skey in json) {
    for (const pkey in json[skey]) {
      const predicts = json[skey][pkey];
      for (const idx in predicts) {
        const o = predicts[idx];
        if (o.type === "bnode") {
          predicts[idx] = json[o.value];
          predicts[idx].termType = "BlankNode";
          delete json[o.value];
        }
      }
    }
  }
  return json;
}
