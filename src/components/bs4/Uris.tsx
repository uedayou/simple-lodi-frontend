import React from 'react';
import { Helmet } from 'react-helmet';

import Rdf from './Rdf';

type Props = {
  uris: any
  target: string
}

function Uris({ uris, target }:Props) {
  let titles:any;
  return (
    <>
      { (uris && uris[target]) &&
        <>
          { createElements(uris, target) }
          <Helmet title={ titles[target] || target} />
        </>
      }
      { uris && Object.keys(uris).map((_uri:string, index:number)=>(
         _uri !== target && <div key={index}>{ createElements(uris, _uri) }</div>
    ))}
    </>
  );

  function createElements(_uris:any, _uri:string) {
    return (
      <>
      { getTitleFromRdf(_uris, _uri) ?
        <div className="jumbotron">
          <div className="container">
            <h2>
              { titles[_uri] }
            </h2>
            <a href={ _uri }>
              { _uri }
            </a>
          </div>
        </div> :
        <h3>
          <a href={ _uri }>
            { _uri }
          </a>
        </h3>
      }
      <Rdf rdfs={ _uris[_uri] } />
      </>
    );
  }

  function getTitleFromRdf(rdfs:any, uri:string) {
    if (!titles) titles = {};
    const props = [
      "http://xmlns.com/foaf/0.1/name",
      "http://purl.org/dc/elements/1.1/title",
      "http://purl.org/dc/terms/title",
      "http://schema.org/name",
      "http://www.w3.org/2000/01/rdf-schema#label"
    ];
    for (const p of props) {
      if ( rdfs[uri][p]) {
        titles[uri] = rdfs[uri][p][0].value;
        break;
      }
    }
    return titles[uri];
  }
}

export default Uris;