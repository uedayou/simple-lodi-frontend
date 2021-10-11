import React from "react";
import { Helmet } from "react-helmet";
import { Container, Typography, Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Rdf from "./Rdf";
import { getLink } from "../lib/utils";

const useStyles = makeStyles((theme) => ({
  main: {
    marginTop: theme.spacing(8),
    marginBottom: theme.spacing(2),
  },
  divider: {
    marginBottom: theme.spacing(4),
  },
}));

type Props = {
  uris: any;
  target: string;
};

function Uris({ uris, target }: Props) {
  const [titles, setTitles] = React.useState<any>({});
  const classes = useStyles();

  const RdfElem = React.memo(
    ({ object, uri }: { object: any; uri: string }) => (
      <>
        {getTitleFromRdf(object, uri) ? (
          <Box>
            <Typography variant="h3" gutterBottom>
              {titles[uri]}
            </Typography>
            <Helmet title={titles[uri] || uri} />
            <Typography variant="subtitle1" gutterBottom>
              {getLink(uri)}
            </Typography>
          </Box>
        ) : (
          <Typography variant="h6" gutterBottom>
            {getLink(uri)}
          </Typography>
        )}
        <Rdf rdfs={object[uri]} />
      </>
    )
  );

  return (
    <Container component="main" className={classes.main} maxWidth="md">
      {uris && uris[target] && (
        <div className={classes.divider}>
          <RdfElem object={uris} uri={target} />
        </div>
      )}
      {uris &&
        Object.keys(uris).map(
          (_uri: string, index: number) =>
            _uri !== target && (
              <div className={classes.divider} key={index}>
                <RdfElem object={uris} uri={_uri} />
              </div>
            )
        )}
    </Container>
  );

  function getTitleFromRdf(rdfs: any, uri: string) {
    const props = [
      "http://xmlns.com/foaf/0.1/name",
      "http://purl.org/dc/elements/1.1/title",
      "http://purl.org/dc/terms/title",
      "http://schema.org/name",
      "http://www.w3.org/2000/01/rdf-schema#label",
    ];
    for (const p of props) {
      if (rdfs[uri][p]) {
        !titles[uri] && setTitles({ ...titles, [uri]: rdfs[uri][p][0].value });
        return true;
      }
    }
  }
}

export default Uris;
