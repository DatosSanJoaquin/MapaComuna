import React, { useState } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// GeoJSON con los límites de San Joaquín
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
            [-70.62590127054578, -33.46945320361493],
            [-70.64215572471073, -33.47771228381367],
            [-70.63885148988345, -33.50708767043848],
            [-70.63766223502776, -33.51178856347028],
            [-70.63641069977058, -33.51870060364446],
            [-70.62713298839951, -33.517811380323316],
            [-70.61997919986852, -33.51446298423921],
            [-70.61495899739091, -33.513181142061775],
            [-70.61128797432949, -33.513207302296465],
            [-70.61144485565669, -33.51072204472325],
            [-70.6138608280992, -33.508158230533546],
            [-70.61780394107791, -33.49185752351995],
            [-70.61882576024759, -33.48695119707186],
            [-70.6204449288464, -33.4852440411388],
            [-70.62436673045724, -33.47016590221997],
            [-70.62590127054578, -33.46945320361493],
          ],
        ],
      },
    },
  ],
};

// Centro de la comuna de San Joaquín
const position = [-33.4928, -70.6405];

// Estilos de mapas disponibles
const tileLayers = {
  normal: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  dark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", // Alto contraste real
};

// **Componente para Zoom Personalizado (Horizontal)**
const CustomZoomControl = () => {
  const map = useMap();

  return (
    <div style={zoomControlStyle}>
      <button onClick={() => map.zoomOut()} style={zoomButtonStyle}>
        ➖
      </button>
      <button onClick={() => map.zoomIn()} style={zoomButtonStyle}>
        ➕
      </button>
    </div>
  );
};

// **Componente de Alto Contraste**
const HighContrastToggle = ({
  setTileLayer,
  isHighContrast,
  setIsHighContrast,
}) => {
  const toggleContrast = () => {
    setIsHighContrast(!isHighContrast);
    setTileLayer(isHighContrast ? tileLayers.normal : tileLayers.dark);
  };

  return (
    <div style={controlStyle}>
      <button
        onClick={toggleContrast}
        style={{
          background: isHighContrast ? "#ff6347" : "#ffffff",
          padding: "8px",
          borderRadius: "5px",
          fontWeight: "bold",
        }}
      >
        {isHighContrast ? "🌍 Modo Normal" : "🌑 Alto Contraste"}
      </button>
    </div>
  );
};

// **Estilos de los controles**
const controlStyle = {
  position: "absolute",
  bottom: "20px",
  left: "10px",
  background: "white",
  padding: "10px",
  borderRadius: "5px",
  boxShadow: "0 2px 5px rgba(0,0,0,0.3)",
  zIndex: 1000,
  display: "flex",
  flexDirection: "column",
  gap: "5px",
};

// **Estilos de los botones de zoom (Horizontal)**
const zoomControlStyle = {
  position: "absolute",
  bottom: "20px", // Mantiene en la parte inferior
  left: "50%", // Centra horizontalmente
  transform: "translateX(-50%)", // Ajuste fino para centrar
  background: "white",
  padding: "10px",
  borderRadius: "10px",
  boxShadow: "0 2px 5px rgba(0,0,0,0.3)",
  zIndex: 1000,
  display: "flex",
  flexDirection: "row", // Se alinean horizontalmente
  gap: "10px",
};

const zoomButtonStyle = {
  fontSize: "18px",
  padding: "8px 12px",
  background: "#ffffff",
  border: "1px solid #ccc",
  borderRadius: "5px",
  cursor: "pointer",
  fontWeight: "bold",
};

function App() {
  const [tileLayer, setTileLayer] = useState(tileLayers.normal);
  const [isHighContrast, setIsHighContrast] = useState(false);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <MapContainer
        center={position}
        zoom={14.5}
        style={{ width: "100%", height: "100%" }}
        zoomControl={false} // **Desactiva el zoom por defecto**
        maxBounds={[
          [-33.52, -70.65],
          [-33.46, -70.61],
        ]}
      >
        <TileLayer
          url={tileLayer}
          attribution="&copy; OpenStreetMap contributors"
        />
        {/* **Controles personalizados** */}
        <CustomZoomControl /> {/* Zoom manual (horizontal) */}
        <HighContrastToggle
          setTileLayer={setTileLayer}
          isHighContrast={isHighContrast}
          setIsHighContrast={setIsHighContrast}
        />
        {/* Área fuera de los límites de San Joaquín (gris) */}
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
                    sanJoaquinGeoJSON.features[0].geometry.coordinates[0],
                  ],
                },
              },
            ],
          }}
          style={{
            fillColor: "#d3d3d3",
            color: "none",
            weight: 0,
            fillOpacity: 0.7,
          }}
        />
        {/* Límite de San Joaquín (borde rojo) */}
        <GeoJSON
          data={sanJoaquinGeoJSON}
          style={{
            fillColor: "#ffffff",
            color: "#6C43AF",
            weight: 2,
            fillOpacity: 0.3,
          }}
        />
      </MapContainer>
    </div>
  );
}

export default App;
