import React, { useState, useEffect } from 'react'

import Uris from './Uris';

import {getHttpData} from '../../utils'

type Result = {
  uri: string
  object: any
}

type Props = {
  uri: string
}

const initialState: Result = {
  uri: "", 
  object: {}
}

function Top({uri}:Props) {
  const [result, setResult] = useState(initialState)
  
  async function getData(url:string) {
    const data = await getHttpData(url);
    // console.log(data);
    if (data && typeof data !== "string") {
      if (data[url] ) {
        if (data[url]["http://xmlns.com/foaf/0.1/primaryTopic"])
          url = data[url]["http://xmlns.com/foaf/0.1/primaryTopic"][0].value;
        if (data[url]["http://schema.org/about"])
          url = data[url]["http://schema.org/about"][0].value;
      }
      setResult({
        uri: url,
        object: data
      })
    }
  }

  useEffect(() => {
    getData(uri);
  }, [uri]);

  return (
    <div className="container">
      <Uris uris={ result.object } target={ result.uri } />
    </div>
  );
}

export default Top;