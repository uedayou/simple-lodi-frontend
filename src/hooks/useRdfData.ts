import React from "react";
import { getHttpData, convUrlInDebug } from "../lib/utils";
import { DEFAULT_ACCEPT_TYPE } from "../conf";

export default function useRdfData(uri: string) {
  const [data, setData] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (!uri) return;
    setIsLoading(true);
    (async () => {
      let _uri = decodeURIComponent(convUrlInDebug(uri));
      const _data = await getHttpData(_uri, DEFAULT_ACCEPT_TYPE);
      if (_data?.[_uri]?.["http://xmlns.com/foaf/0.1/primaryTopic"])
        _uri = _data[_uri]["http://xmlns.com/foaf/0.1/primaryTopic"][0].value;
      if (_data?.[_uri]?.["http://schema.org/about"])
        _uri = _data[_uri]["http://schema.org/about"][0].value;
      setData({ uri: _uri, object: _data });
      setIsLoading(false);
    })();
  }, [uri]);

  return [data, isLoading];
}
