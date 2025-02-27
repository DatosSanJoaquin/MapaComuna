import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  useMap,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./CSS/Estilos.css";
import { createCustomMarker } from "./Funciones";

import { Contrast, Add, Remove, Tune } from "@mui/icons-material";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";

const LightTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.white,
    color: "rgba(0, 0, 0, 0.87)",
    boxShadow: theme.shadows[1],
    fontSize: 11,
  },
}));

// Estilos de mapas disponibles
const tileLayers = {
  normal: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  dark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", // Alto contraste real
};

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

const zona1GeoJSON = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { name: "Zona 1" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-70.61869735772171, -33.48757593895469],
            [-70.61882571462009, -33.48695125547987],
            [-70.62044490584024, -33.48524405046253],
            [-70.62436687366109, -33.47016591341048],
            [-70.62590121458548, -33.46945329526644],
            [-70.64215579472027, -33.47771264084765],
            [-70.6418008446113, -33.48086738192702],
            [-70.61869735772171, -33.48757593895469],
          ],
        ],
      },
    },
  ],
};

const zona2GeoJSON = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { name: "Zona 2" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-70.62863788630588, -33.494552900036446],
            [-70.61702188404143, -33.49510131605335],
            [-70.617786871239, -33.49195312375639],
            [-70.61871814012747, -33.48757041404239],
            [-70.6292450291646, -33.4845051687902],
            [-70.62939470057245, -33.484921271793624],
            [-70.6295111116674, -33.48526802276999],
            [-70.62964415291948, -33.48561477235932],
            [-70.62968601537186, -33.486048981774886],
            [-70.62931168356263, -33.49314188181485],
            [-70.62925179047325, -33.49360389916234],
            [-70.62913200429448, -33.49395353227372],
            [-70.62890740520871, -33.49429067715071],
            [-70.62863788630588, -33.494552900036446],
          ],
        ],
      },
    },
  ],
};

// Agregar las dos zonas en un solo array
const zonas = [
  { data: zona1GeoJSON, name: "Zona 1" },
  { data: zona2GeoJSON, name: "Zona 2" },
];

// Centro de la comuna de San Joaquín
const position = [-33.4928, -70.6405];

// 📌 Definir un nivel de zoom mínimo para mostrar los marcadores
const MIN_ZOOM_FOR_MARKERS = 16;
const MIN_ZOOM_FOR_MARKERS_First_Level = 15;
const SHOW_FIRST_LEVEL_MARKERS_ZOOM = 15; // Nivel de zoom para volver a mostrar firstLevel

// const customIcon = new L.Icon({
//   iconUrl: `${process.env.PUBLIC_URL}/icons/marker-icon.png`,
//   iconSize: [35, 35],
//   iconAnchor: [17, 45],
//   popupAnchor: [0, -45],
// });

// const customIcon2 = new L.Icon({
//   iconUrl: `${process.env.PUBLIC_URL}/icons/marker-icon2.png`, // Nuevo icono
//   iconSize: [35, 35],
//   iconAnchor: [17, 45],
//   popupAnchor: [0, -45],
// });

// 📍 Definir la lista de marcadores Nivel 1
const markersDataFirstLevel = [
  {
    id: 1,
    name: "Parque Isabel Riquelme",
    position: [-33.483, -70.632],
    icon: createCustomMarker(`${process.env.PUBLIC_URL}/icons/tree.png`),
  },
];

// 📍 Definir la lista de marcadores con el nuevo estilo
const markersData = [
  {
    id: 1,
    name: "Punto Prueba 1",
    position: [-33.481, -70.628],
    icon: createCustomMarker(`${process.env.PUBLIC_URL}/icons/marker-icon.png`),
  },
  {
    id: 2,
    name: "Punto Prueba 2",
    position: [-33.495, -70.635],
    icon: createCustomMarker(
      `${process.env.PUBLIC_URL}/icons/marker-icon2.png`
    ),
  },
];

// // **📌 Lista de marcadores con diferentes iconos**
// const markersData = [
//   {
//     id: 1,
//     name: "Marcador 1",
//     position: [-33.497, -70.635],
//     icon: customIcon,
//   },
//   {
//     id: 2,
//     name: "Marcador 2 (Nuevo Icono)",
//     position: [-33.495, -70.635],
//     icon: customIcon2,
//   }, // Nuevo marcador con icono 2
// ];

// **Componente para Zoom Personalizado (Horizontal)**
const CustomControls_ = ({
  setTileLayer,
  isHighContrast,
  setIsHighContrast,
}) => {
  const map = useMap();

  const toggleContrast = () => {
    setIsHighContrast(!isHighContrast);
    setTileLayer(isHighContrast ? tileLayers.normal : tileLayers.dark);
  };

  return (
    // <div style={zoomControlStyle}>
    //   <button onClick={() => map.zoomOut()} style={zoomButtonStyle}>
    //     ➖
    //   </button>
    //   <button onClick={() => map.zoomIn()} style={zoomButtonStyle}>
    //     ➕
    //   </button>
    // </div>
    <>
      <div className="contenedorControl" style={{ cursor: "pointer" }}>
        <div className="controlZoom">
          <Add style={{ color: "white" }} onClick={() => map.zoomIn()} />
        </div>
        <div className="controlZoom">
          <Remove style={{ color: "white" }} onClick={() => map.zoomOut()} />
        </div>

        <div
          className="controlStyleAltoContraste2"
          style={{ cursor: "pointer" }}
          onClick={toggleContrast}
        >
          <LightTooltip title="Alto Contraste" placement="right">
            <Contrast
              style={{
                color: isHighContrast ? "#A2A09F" : "white",
              }}
            />
          </LightTooltip>
        </div>
      </div>
    </>
  );
};

// // **Componente de Alto Contraste**
// const HighContrastToggle = ({
//   setTileLayer,
//   isHighContrast,
//   setIsHighContrast,
// }) => {
//   const toggleContrast = () => {
//     setIsHighContrast(!isHighContrast);
//     setTileLayer(isHighContrast ? tileLayers.normal : tileLayers.dark);
//   };

//   return (
//     <div
//       className="controlStyleAltoContraste"
//       onClick={toggleContrast}
//       style={{ cursor: "pointer" }}
//     >
//       <LightTooltip
//         title={
//           isHighContrast
//             ? "Desactivar alto contraste"
//             : "Activar alto contraste"
//         }
//         placement="right"
//       >
//         <Contrast
//           style={{
//             color: isHighContrast ? "#A2A09F" : "white",
//           }}
//         />
//       </LightTooltip>

//       {/* <button
//         onClick={toggleContrast}
//         style={{
//           background: isHighContrast ? "#ff6347" : "#ffffff",
//           padding: "8px",
//           borderRadius: "5px",
//           fontWeight: "bold",
//         }}
//       >
//         {isHighContrast ? "🌍 Modo Normal" : "🌑 Alto Contraste"}
//       </button> */}
//     </div>
//   );
// };

// // **Estilos de los controles**
// const controlStyle = {
//   position: "absolute",
//   bottom: "20px",
//   left: "10px",
//   background: "white",
//   padding: "10px",
//   borderRadius: "5px",
//   boxShadow: "0 2px 5px rgba(0,0,0,0.3)",
//   zIndex: 1000,
//   display: "flex",
//   flexDirection: "column",
//   gap: "5px",
// };

// const zoomButtonStyle = {
//   fontSize: "18px",
//   padding: "8px 12px",
//   background: "#ffffff",
//   border: "1px solid #ccc",
//   borderRadius: "5px",
//   cursor: "pointer",
//   fontWeight: "bold",
// };

function App() {
  const [tileLayer, setTileLayer] = useState(tileLayers.normal);
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [showMarkers, setShowMarkers] = useState(false);
  const [showMarkersFirstLevel, setShowMarkersFirstLevel] = useState(false);
  const [showPanel, setShowPanel] = useState(false);

  const [zona1Style, setZona1Style] = useState({
    fillColor: "rgba(0, 255, 0, 0.1)", // Verde claro semi-transparente
    color: "green", // Borde verde
    weight: 2,
    fillOpacity: 0.1,
  });

  const estilosZonas = {
    fillColor: "rgba(0, 255, 0, 0.1)", // Verde claro semi-transparente
    color: "green", // Borde verde
    weight: 2,
    fillOpacity: 0.1,
  };

  function MarkerVisibilityController() {
    const map = useMap();

    useEffect(() => {
      const updateMarkersVisibility = () => {
        const currentZoom = map.getZoom();
        console.log("zoom effect", currentZoom);
        setShowMarkers(currentZoom >= MIN_ZOOM_FOR_MARKERS);
        setShowMarkersFirstLevel(currentZoom <= SHOW_FIRST_LEVEL_MARKERS_ZOOM);
      };

      // 📌 Ejecutar la función al cargar la página
      updateMarkersVisibility();

      // 📌 Escuchar cambios en el zoom
      map.on("zoomend", updateMarkersVisibility);

      return () => {
        map.off("zoomend", updateMarkersVisibility);
      };
    }, [map]);

    return null;
  }

  // 📌 Evento al pasar el mouse
  const onMouseOver = () => {
    setZona1Style({
      fillColor: "rgba(0, 255, 0, 0.4)", // Más visible al pasar el mouse
      color: "green",
      weight: 2,
      fillOpacity: 0.3,
    });
  };

  // 📌 Evento al salir el mouse
  const onMouseOut = () => {
    setZona1Style({
      fillColor: "rgba(0, 255, 0, 0.2)", // Vuelve al color inicial
      color: "green",
      weight: 2,
      fillOpacity: 0.1,
    });
  };

  function CustomTopRightButton() {
    return (
      <div
        className="top-right-button"
        onClick={() => setShowPanel(!showPanel)}
        style={{
          cursor: "pointer",
        }}
      >
        {/* <button className="map-button">🔘</button> */}
        <LightTooltip title="Filtrar por tematicas" placement="left">
          <Tune style={{ color: "white" }} />
        </LightTooltip>
      </div>
    );

    //5D428B
  }

  // // 📌 Componente para manejar el cambio de zoom y mostrar/ocultar marcadores
  // const MarkerVisibilityController = ({ setShowMarkers }) => {
  //   useMapEvents({
  //     zoomend: (e) => {
  //       const currentZoom = e.target.getZoom();
  //       setShowMarkers(currentZoom >= MIN_ZOOM_FOR_MARKERS); // ✅ Se actualiza correctamente al hacer zoom in y out
  //     },
  //   });

  //   return null; // No renderiza nada, solo maneja eventos
  // };

  // // 📌 Componente para manejar el zoom y mostrar/ocultar marcadores
  // const MarkerVisibilityController = () => {
  //   useMapEvents({
  //     zoomend: (e) => {
  //       const currentZoom = e.target.getZoom();
  //       console.log("zoom", currentZoom);
  //       setShowMarkers(currentZoom >= MIN_ZOOM_FOR_MARKERS); // ✅ Se activan solo al acercar
  //       setShowMarkersFirstLevel(
  //         currentZoom <= SHOW_FIRST_LEVEL_MARKERS_ZOOM || currentZoom === 14.5
  //       ); // ✅ Se muestran al alejar
  //     },
  //   });
  //   return null; // No renderiza nada, solo maneja eventos
  // };

  // 📌 Componente para manejar el cambio de zoom y mostrar/ocultar marcadores
  // const MarkerVisibilityControllerFirstLevel = ({ setShowMarkers }) => {
  //   useMapEvents({
  //     zoomend: (e) => {
  //       const currentZoom = e.target.getZoom();
  //       console.log("zoom first", currentZoom);
  //       setShowMarkers(currentZoom >= MIN_ZOOM_FOR_MARKERS_First_Level); // ✅ Se actualiza correctamente al hacer zoom in y out
  //     },
  //   });

  //   return null; // No renderiza nada, solo maneja eventos
  // };

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <div className={`panel-lateral ${!showPanel ? "active" : ""}`}>
        <h3 style={{ color: "#41285E" }}>Panel de Filtros</h3>
        {/* <p>Aquí puedes agregar información adicional.</p> */}
      </div>

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
        <MarkerVisibilityController />
        {/* <MarkerVisibilityControllerFirstLevel
          setShowMarkers={setShowMarkersFirstLevel}
        /> */}
        {/* **Controles personalizados** */}
        <CustomControls_
          setTileLayer={setTileLayer}
          isHighContrast={isHighContrast}
          setIsHighContrast={setIsHighContrast}
        />{" "}
        {/* Zoom manual (horizontal) */}
        {/* <HighContrastToggle
          setTileLayer={setTileLayer}
          isHighContrast={isHighContrast}
          setIsHighContrast={setIsHighContrast}
        /> */}
        {/* Área fuera de los límites de San Joaquín (gris) */}
        <CustomTopRightButton />
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
                    sanJoaquinGeoJSON.features[0].geometry.coordinates[0], // Se excluye San Joaquín
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
        {/* 🟢 Zona 1 dentro de San Joaquín */}
        {/* <GeoJSON
          data={zona1GeoJSON}
          style={zona1Style}
          eventHandlers={{
            mouseover: onMouseOver,
            mouseout: onMouseOut,
          }}
        /> */}
        {zonas.map((zona, index) => (
          <GeoJSON
            key={index}
            data={zona.data}
            style={estilosZonas}
            eventHandlers={{
              mouseover: (e) => {
                e.layer.setStyle({
                  fillColor: "rgba(0, 255, 0, 0.4)",
                  fillOpacity: 0.3,
                });
              },
              mouseout: (e) => {
                e.layer.setStyle(estilosZonas);
              },
            }}
          />
        ))}
        {/* 📍 Renderizar marcadores con iconos personalizados */}
        {/* 📍 Renderizar los marcadores generales al iniciar, pero ocultarlos si el usuario acerca el zoom */}
        <MarkerVisibilityController />
        {showMarkersFirstLevel &&
          markersDataFirstLevel.map((marker) => (
            <Marker
              key={marker.id}
              position={marker.position}
              icon={marker.icon}
            >
              <Popup>{marker.name}</Popup>
            </Marker>
          ))}
        {/* 📍 Renderizar los marcadores solo si `showMarkers` es true */}
        {showMarkers
          ? markersData.map((marker) => (
              <Marker
                key={marker.id}
                position={marker.position}
                icon={marker.icon}
              >
                <Popup>{marker.name}</Popup>
              </Marker>
            ))
          : null}
        {/* <Marker
          key={4}
          position={[-33.483, -70.632]}
          icon={createCustomMarker(`${process.env.PUBLIC_URL}/icons/tree.png`)}
        >
          <Popup>Parque Isabel Riquelme</Popup>
        </Marker> */}
        {/* {showMarkersFirstLevel
          ? markersDataFirstLevel.map((marker) => (
              <Marker
                key={marker.id}
                position={marker.position}
                icon={marker.icon}
              >
                <Popup>{marker.name}</Popup>
              </Marker>
            ))
          : null} */}
      </MapContainer>
    </div>
  );
}

export default App;
