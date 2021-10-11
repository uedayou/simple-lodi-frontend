import React from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import Leaflet from "leaflet";
import "leaflet/dist/leaflet.css";
Leaflet.Icon.Default.imagePath =
  "//cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/";

type Props = {
  geojson: any;
};

function Map({ geojson }: Props) {
  const [map, setMap] = React.useState<Leaflet.Map>();

  React.useEffect(() => {
    if (map && geojson?.features?.length > 0) {
      const geojsonObject = Leaflet.geoJSON(geojson);
      map.fitBounds(geojsonObject.getBounds());
    }
  }, [geojson, map]);

  return (
    <MapContainer
      whenCreated={setMap}
      center={[35, 135]}
      zoom={10}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <GeoJSON data={geojson} />
    </MapContainer>
  );
}

export default Map;
