import React, { useState, useEffect } from 'react'

import { makeStyles } from '@material-ui/core/styles';

import Uris from './Uris';

import {
  getHttpData,
  convUrlInDebug
} from '../../lib/utils'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh'
  }
}));

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

function Top({uri}: Props) {
  const classes = useStyles();
  const [result, setResult] = useState(initialState)
  
  async function getData(url: string) {
    url = convUrlInDebug(url);
    const data = await getHttpData(url);
    if (data && typeof data !== "string") {
      if (data[url] ) {
        if (data[url]["http://xmlns.com/foaf/0.1/primaryTopic"])
          url = data[url]["http://xmlns.com/foaf/0.1/primaryTopic"][0].value;
        if (data[url]["http://schema.org/about"])
          url = data[url]["http://schema.org/about"][0].value;
      }
      return { uri: url, object: data };
    }
  }

  useEffect(() => {
    let isSubscribed = true;
    (async()=>{
      const obj = await getData(uri);
      if (isSubscribed && obj) {
        setResult(obj);
      }
    })();
    return () => {
      isSubscribed = false;
    }
  }, [uri]);

  return (
    <div className={classes.root}>
      <Uris uris={ result.object } target={ result.uri } />
    </div>
  );
}

export default Top;