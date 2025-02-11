import React from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// GeoJSON con los límites de San Joaquín (ajusta las coordenadas según corresponda)
const sanJoaquinGeoJSON = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {},
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-70.654, -33.502], // Punto 1
            [-70.634, -33.502], // Punto 2
            [-70.634, -33.484], // Punto 3
            [-70.654, -33.484], // Punto 4
            [-70.654, -33.502], // Cerrar el polígono
          ],
        ],
      },
    },
  ],
};

const position = [-33.4928, -70.6405]; // Coordenadas centrales de San Joaquín

function App() {
  const styleOutside = {
    fillColor: "#d3d3d3", // Gris para el área fuera de la comuna
    color: "none", // Sin borde
    weight: 0,
    fillOpacity: 0.7, // Transparencia para el área gris
  };

  const styleInside = {
    fillColor: "#ffffff", // Blanco o transparente dentro de la comuna
    color: "none", // Sin borde
    weight: 0,
    fillOpacity: 0.3, // Ligera transparencia dentro de la comuna
  };

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <MapContainer
        center={position}
        zoom={17} // Nivel de zoom más cercano para mostrar las calles
        style={{ width: "100%", height: "100%" }}
        maxBounds={[
          [-33.502, -70.654], // Limite Sur-Oeste
          [-33.484, -70.634], // Limite Norte-Este
        ]}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {/* Área fuera de los límites */}
        <GeoJSON
          data={{
            type: "FeatureCollection",
            features: [
              {
                type: "Feature",
                properties: {},
                geometry: {
                  type: "Polygon",
                  coordinates: [
                    [
                      [-180, 90],
                      [180, 90],
                      [180, -90],
                      [-180, -90],
                      [-180, 90],
                    ],
                    sanJoaquinGeoJSON.features[0].geometry.coordinates[0], // Excluir el área de San Joaquín
                  ],
                },
              },
            ],
          }}
          style={styleOutside}
        />
        {/* Límite de San Joaquín (sin borde visible) */}
        <GeoJSON data={sanJoaquinGeoJSON} style={styleInside} />
      </MapContainer>
    </div>
  );
}

export default App;
