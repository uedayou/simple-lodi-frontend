import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Uris from "./Uris";
import useRdfData from "../hooks/useRdfData";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
  },
}));

type Props = {
  uri: string;
};

function Top({ uri }: Props) {
  const classes = useStyles();
  const [data] = useRdfData(uri);

  return (
    <div className={classes.root}>
      <Uris uris={data?.object} target={data?.uri} />
    </div>
  );
}

export default Top;
