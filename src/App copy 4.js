import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const testIcon = L.divIcon({
  className: "custom-marker",
  html: `<div style='width: 30px; height: 30px; background: red; border-radius: 50%;'></div>`,
  iconSize: [30, 30],
  iconAnchor: [15, 15],
});

const position = [-33.47815253264534, -70.64164512653193];

function TestMap() {
  return (
    <MapContainer
      center={position}
      zoom={16}
      style={{ width: "100vw", height: "100vh" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      <Marker
        position={[-33.47815253264534, -70.64164512653193]}
        icon={testIcon}
      >
        <Popup>📍 Prueba de marcador en San Joaquín</Popup>
      </Marker>
    </MapContainer>
  );
}

export default TestMap;
