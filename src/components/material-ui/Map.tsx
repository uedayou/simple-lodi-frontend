import React from 'react';
import { Map as MapElem, TileLayer, GeoJSON } from 'react-leaflet'

import Leaflet from 'leaflet'
import 'leaflet/dist/leaflet.css';
Leaflet.Icon.Default.imagePath =
  '//cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/'

type Props = {
  geojson: any
}

function Map({ geojson }: Props) {
  let mapRef:any;
  return (
    <MapElem ref={(ref) => { mapRef = ref; }} center={[35, 135]} zoom={10}>
      <TileLayer
        attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      { geojson && 
        <GeoJSON 
          ref={(ref:any)=>mapRef.leafletElement.fitBounds(ref.leafletElement.getBounds())} 
          data={geojson} />
      }
    </MapElem>
  );
}

export default Map;