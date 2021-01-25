import React from 'react';

import {shorten, getGeoJsonFromWkt, getLink} from '../../lib/utils';

import Bnode from './Bnode'
import Map from './Map'

type Props = {
  rdfs: any
}

function Rdf({ rdfs }:Props) {
  let geojson:any;

  return (
    <>
      <table className="table table-bordered">
        <tbody>
          { (!rdfs || Object.keys(rdfs).length === 0) && 
            <tr><td colSpan={2}>データがありません</td></tr> }
          { rdfs && Object.keys(rdfs).map((key:string, index:number) => (
            <tr key={index}>
              <th>
                { getProp(key) }
              </th>
              <td>
                { Object.keys(rdfs[key]).map((key2:string, index2:number) =>
                  <div key={index+"-"+index2}>{ getValues(rdfs[key][key2]) }</div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
  	  </table>
      { (rdfs && convGeoJsonFromRdfs(rdfs)) &&
        <Map geojson={geojson} /> }
    </>
  );

  function convGeoJsonFromRdfs(rdfs:any) {
    let prop = "http://www.opengis.net/ont/geosparql#asWKT";
    let geojsons = [];
    if (rdfs[prop]) {
      for (let obj of rdfs[prop]) {
        geojsons.push(getGeoJsonFromWkt(obj.value));
      }
    }
    let lat, long;
    prop = "http://www.w3.org/2003/01/geo/wgs84_pos#lat";
    if (prop in rdfs) lat = Number(rdfs[prop][0].value);
    prop = "http://www.w3.org/2003/01/geo/wgs84_pos#long";
    if (prop in rdfs) long = Number(rdfs[prop][0].value);
    if (lat&&long) {
      geojsons.push(getGeoJsonFromWkt(`POINT(${long} ${lat})`));
    }
    if (geojsons.length>0) {
      geojson = {
        type: "FeatureCollection" as const,
        features: [...geojsons]
      };
    } 
    return geojson;
  }
}

export default Rdf;

function getProp(key:string) {
  if (key.match(new RegExp("^https?://.+$", "i"))) {
    return <a href={key} target="_blank">{shorten(key)}</a>
  } else {
    return shorten(key); 
  }
}

function getValues(v:any) {
  if (v) {
    if (v.type && v.type === "bnode") {
      return (<Bnode bnode={v} />);
    } else if (v.value) {
      return getLink(v.value);
      //return <ReadMoreReact text={ v.value } />
    }
  }
  return "";
}