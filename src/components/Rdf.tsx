import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
} from "@material-ui/core";
import Bnode from "./Bnode";
import Map from "./Map";
import { shorten, getGeoJsonFromWkt, getLink } from "../lib/utils";

type Props = {
  rdfs: any;
};

function Rdf({ rdfs }: Props) {
  const [geojson, setGeojson] = React.useState<any>(null);

  React.useEffect(() => convGeoJsonFromRdfs(rdfs), [rdfs]);

  function convGeoJsonFromRdfs(rdfs: any) {
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
    if (lat && long) {
      geojsons.push(getGeoJsonFromWkt(`POINT(${long} ${lat})`));
    }
    if (geojsons.length > 0) {
      setGeojson({
        type: "FeatureCollection" as const,
        features: [...geojsons],
      });
    }
  }

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            {(!rdfs || Object.keys(rdfs).length === 0) && (
              <TableRow>
                <TableCell colSpan={2}>データがありません</TableCell>
              </TableRow>
            )}
            {rdfs &&
              Object.keys(rdfs).map((key: string, index: number) => (
                <TableRow key={index}>
                  <TableCell>{getProp(key)}</TableCell>
                  <TableCell>
                    {Object.keys(rdfs[key]).map(
                      (key2: string, index2: number) => (
                        <div key={`${index}-${index2}`}>
                          {getValues(rdfs[key][key2])}
                        </div>
                      )
                    )}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      {geojson && <Map geojson={geojson} />}
    </>
  );
}

export default Rdf;

function getProp(key: string) {
  if (key.match(new RegExp("^https?://.+$", "i"))) {
    return (
      <a href={key} target="_blank" rel="noopener noreferrer">
        {shorten(key)}
      </a>
    );
  } else {
    return shorten(key);
  }
}

function getValues(v: any) {
  if (v) {
    if (v.termType === "BlankNode") {
      delete v.termType;
      return <Bnode bnode={v} />;
    } else {
      return getLink(v.value);
    }
  }
  return "";
}
