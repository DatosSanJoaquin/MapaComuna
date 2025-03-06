import React, { useState, useEffect, useRef } from "react";
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
import "bootstrap/dist/css/bootstrap.min.css";

import { Contrast, Add, Remove, Tune } from "@mui/icons-material";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import { readCSVFile } from "./Function/readFile";
import { Row } from "react-bootstrap";
import { CampoDropDownSearchSimple } from "./Function/Campos";

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
            [-70.62873080676333, -33.49447213227842],
            [-70.61702802114368, -33.49506746357986],
            [-70.61765031737245, -33.492493395420006],
            [-70.61780053280718, -33.491874500111244],
            [-70.61791039320438, -33.491339739011345],
            [-70.61869532001406, -33.48757716188838],
            [-70.61922430756114, -33.48742326251127],
            [-70.62925340647404, -33.48451117504671],
            [-70.62930089234268, -33.48463835000919],
            [-70.62943660485149, -33.485024998534826],
            [-70.62964490159776, -33.4856137670009],
            [-70.62968229954222, -33.48604303545963],
            [-70.62950565702425, -33.489441722667465],
            [-70.62944350799768, -33.49062307906245],
            [-70.62938628217636, -33.491735966540936],
            [-70.62931148900755, -33.49314047832069],
            [-70.62927834302536, -33.49340124133554],
            [-70.62925286620253, -33.493601687263],
            [-70.62913202110238, -33.49395373934823],
            [-70.62890815089506, -33.4942899107362],
            [-70.62873080676333, -33.49447213227842],
          ],
        ],
      },
    },
  ],
};

const zona3GeoJSON = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { name: "Zona 3" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-70.6292541322674, -33.48450832485099],
            [-70.64180073211287, -33.48086749811504],
            [-70.6401687615225, -33.4953027326352],
            [-70.63355764067805, -33.49569884213655],
            [-70.63348269117542, -33.49434951018601],
            [-70.62872547592306, -33.49446728493356],
            [-70.62890802528423, -33.49429018939613],
            [-70.62913216887655, -33.493953471802314],
            [-70.62925259067583, -33.49360180337262],
            [-70.62931164770932, -33.49314191180191],
            [-70.62968244289007, -33.48604284420904],
            [-70.62964502289606, -33.48561483356125],
            [-70.6292541322674, -33.48450832485099],
          ],
        ],
      },
    },
  ],
};

const zona4GeoJSON = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { name: "Zona 4" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-70.62591727377149, -33.50748948250254],
            [-70.62852698542208, -33.495716021228624],
            [-70.62864458188302, -33.49476285735156],
            [-70.62873640417725, -33.4944676802021],
            [-70.6334822649486, -33.49435022806495],
            [-70.63355762368445, -33.49569792459454],
            [-70.64005300463121, -33.49530943342911],
            [-70.64017705077237, -33.49530373168444],
            [-70.63961374916174, -33.50031286312337],
            [-70.63886129095667, -33.507011459008005],
            [-70.6388449439563, -33.50712595452595],
            [-70.63213468130482, -33.50705515326358],
            [-70.62591727377149, -33.50748948250254],
          ],
        ],
      },
    },
  ],
};

const zona5GeoJSON = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { name: "Zona 5" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-70.6287370311583, -33.49446818330502],
            [-70.62864454489107, -33.49476267120667],
            [-70.62852683509688, -33.49571624420515],
            [-70.62801395670687, -33.498008983358325],
            [-70.62591714824667, -33.507489623647665],
            [-70.6138700195153, -33.50814887140895],
            [-70.61702807350042, -33.49506826911785],
            [-70.6287370311583, -33.49446818330502],
          ],
        ],
      },
    },
  ],
};

const zona6GeoJSON = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { name: "Zona 6" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-70.62591718293768, -33.50748937457517],
            [-70.63213433772793, -33.50705504406083],
            [-70.63884530573755, -33.50712586491835],
            [-70.63765614891791, -33.511827615555966],
            [-70.6364106590797, -33.518700617216076],
            [-70.62713297315615, -33.517811247994054],
            [-70.62412364022622, -33.51640423705381],
            [-70.62468109915297, -33.51548785990036],
            [-70.62481770723055, -33.514847160422725],
            [-70.62481314070283, -33.514431323031545],
            [-70.62480756107001, -33.51400217486848],
            [-70.62481758282115, -33.512925535750846],
            [-70.62591718293768, -33.50748937457517],
          ],
        ],
      },
    },
  ],
};

const zona7GeoJSON = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { name: "Zona 7" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-70.62591721096223, -33.507489760236396],
            [-70.62495288564863, -33.512296713770006],
            [-70.62481728903487, -33.512926595065316],
            [-70.62480760356291, -33.51400061285139],
            [-70.62481730004147, -33.514848515166264],
            [-70.62473013078987, -33.51526842415309],
            [-70.62468099650279, -33.51548833792732],
            [-70.62412371572667, -33.516404124438964],
            [-70.61997914362878, -33.51446301163217],
            [-70.61495907973013, -33.51318117386764],
            [-70.61128817072773, -33.513207114165056],
            [-70.6114431274966, -33.51072462811946],
            [-70.61386428645446, -33.508148742759616],
            [-70.62591721096223, -33.507489760236396],
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
  { data: zona3GeoJSON, name: "Zona 3" },
  { data: zona4GeoJSON, name: "Zona 4" },
  { data: zona5GeoJSON, name: "Zona 5" },
  { data: zona6GeoJSON, name: "Zona 6" },
  { data: zona7GeoJSON, name: "Zona 7" },
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
    icon: createCustomMarker(`${process.env.PUBLIC_URL}/icons/Camioneta.png`),
  },
];

// 📍 Definir la lista de marcadores con el nuevo estilo
// const markersData = [
//   {
//     id: 1,
//     name: "Punto Prueba 1",
//     position: [-33.481, -70.628],
//     icon: createCustomMarker(`${process.env.PUBLIC_URL}/icons/Camioneta.png`),
//   },
//   {
//     id: 2,
//     name: "Punto Prueba 2",
//     position: [-33.495, -70.635],
//     icon: createCustomMarker(
//       `${process.env.PUBLIC_URL}/icons/marker-icon2.png`
//     ),
//   },
// ];

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
  const [markersData, setMarkersData] = useState([]);
  const [opcionCategorias, setOpcionCategorias] = useState([]);
  const hasFetched = useRef(false); // Definir useRef fuera del useEffect

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

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;

      readCSVFile()
        .then(({ markers, categoriasUnicas }) => {
          console.log("Marcadores desde archivo", markers);
          console.log("Categorías únicas", categoriasUnicas);
          setOpcionCategorias(categoriasUnicas);
          setMarkersData(markers);
        })
        .catch((error) =>
          console.error("Error leyendo el archivo CSV:", error)
        );
    }
  }, []); // Se ejecuta solo una vez al montar el componente

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
        <h5 style={{ color: "#41285E" }}>Panel de Filtros</h5>
        {/* <p>Aquí puedes agregar información adicional.</p> */}
        <Row>
          <CampoDropDownSearchSimple
            PropiedadesCampo={{
              Ancho: 12,
              NombreCampo: "Estado",
              IdCampo: "Estado",
              MultiSelect: false,
              Disabled: false,
              Opciones: opcionCategorias,
              Clearable: false,
            }}
            Valor={""}
            OnChange={(e, i) => {
              console.log("e", e);
              console.log("i", i);
            }}
          />
        </Row>
      </div>

      <MapContainer
        center={position}
        zoom={14}
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
        {/* {showMarkersFirstLevel &&
          markersDataFirstLevel.map((marker) => (
            <Marker
              key={marker.id}
              position={marker.position}
              icon={marker.icon}
            >
              <Popup>{marker.name}</Popup>
            </Marker>
          ))} */}
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
