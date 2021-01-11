import React from 'react';
import { Helmet } from 'react-helmet';

import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';

import Rdf from './Rdf';
import { getLink } from '../../utils';

const useStyles = makeStyles((theme) => ({
  main: {
    marginTop: theme.spacing(8),
    marginBottom: theme.spacing(2)
  },
  divider: {
    marginBottom: theme.spacing(4)
  }
}));

type Props = {
  uris: any
  target: string
}

function Uris({ uris, target }:Props) {
  const classes = useStyles();
  let titles:any;
  return (
    <Container component="main" className={classes.main} maxWidth="md">
      { (uris && uris[target]) &&
        <div className={classes.divider}>
          { createElements(uris, target) }
        </div>
      }
      { uris && Object.keys(uris).map((_uri:string, index:number)=>(
         _uri !== target && 
        <div className={classes.divider} key={index}>
          { createElements(uris, _uri) }
        </div>
      ))}
    </Container>
  );

  function createElements(_uris:any, _uri:string) {
    return (
      <>
      { getTitleFromRdf(_uris, _uri) ?
        <Box>
          <Typography variant="h3" gutterBottom>
            { titles[_uri] }
          </Typography>
          <Helmet title={ titles[_uri] || _uri } />
          <Typography variant="subtitle1" gutterBottom>
            { getLink(_uri) }
          </Typography>
        </Box> :
        <Typography variant="h6" gutterBottom>
          { getLink(_uri) }
        </Typography>
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