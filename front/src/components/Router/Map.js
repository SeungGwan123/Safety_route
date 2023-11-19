import React, { useRef } from "react";
import "leaflet/dist/leaflet.css";
import "../styles/style.scss";
import L from "leaflet";

import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  Polyline,
  Circle,
  ZoomControl,
} from "react-leaflet";

function Map({
  markerPosition,
  setMarkerPosition,
  mapRef,
  decode,
  cctvCircles,
  osrmPolylines,
}) {
  const customIcon = new L.Icon({
    iconUrl: require("../img/search.png"),
    iconSize: [30, 40],
    iconAnchor: [12, 24],
  });

  return (
    <MapContainer
      center={markerPosition}
      zoom={15}
      scrollWheelZoom={true}
      style={{ width: "100%", height: "100vh" }}
      ref={mapRef}
      whenCreated={(map) => {
        mapRef.current = map;
      }}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="http://xdworld.vworld.kr:8080/2d/Base/202002/{z}/{x}/{y}.png"
      />
      <Marker position={markerPosition} icon={customIcon}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
      {osrmPolylines &&
        osrmPolylines.map((osrmPolyline, index) => (
          <Polyline
            key={index}
            positions={decode(osrmPolyline, { precision: 5 })}
            color="rgb(4, 117, 244)"
            weight={6}
          />
        ))}
      {cctvCircles} {/* Render the circles */}
    </MapContainer>
  );
}

export default Map;
