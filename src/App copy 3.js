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

// Centro de la comuna de San Joaquín
const position = [-33.4928, -70.6405];

// 📌 Definir un nivel de zoom mínimo para mostrar los marcadores
const MIN_ZOOM_TO_HIDE_LABELS = 15;
const MIN_ZOOM_FOR_MARKERS = 16;
//const MIN_ZOOM_FOR_MARKERS = 14;
const MIN_ZOOM_FOR_MARKERS_First_Level = 15;
const SHOW_FIRST_LEVEL_MARKERS_ZOOM = 15; // Nivel de zoom para volver a mostrar firstLevel

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
  {
    data: zona1GeoJSON,
    name: "1",
    center: [-33.476, -70.629],
    posicionLabel: [-33.471, -70.627],
  },
  {
    data: zona2GeoJSON,
    name: "2",
    center: [-33.488, -70.636],
    posicionLabel: [-33.488, -70.636],
  },
  {
    data: zona3GeoJSON,
    name: "3",
    center: [-33.488, -70.625],
    posicionLabel: [-33.488, -70.625],
  },
  {
    data: zona4GeoJSON,
    name: "4",
    center: [-33.499, -70.634],
    posicionLabel: [-33.499, -70.634],
  },
  {
    data: zona5GeoJSON,
    name: "5",
    center: [-33.49955463741224, -70.62225250078757],
    posicionLabel: [-33.49955463741224, -70.622252500787],
  },
  {
    data: zona6GeoJSON,
    name: "6",
    center: [-33.51, -70.633],
    posicionLabel: [-33.51, -70.633],
  },
  {
    data: zona7GeoJSON,
    name: "7",
    center: [-33.509267361282426, -70.61983410949249],
    posicionLabel: [-33.509267361282426, -70.61983410949249],
  },
];

const ZoneLabels = ({ setShowLabels }) => {
  const map = useMapEvents({
    zoomend: () => {
      const zoom = map.getZoom();
      setShowLabels(zoom < MIN_ZOOM_TO_HIDE_LABELS);
    },
  });
  return null;
};

// 📍 Definir la lista de marcadores Nivel 1
const markersDataFirstLevel = [
  {
    id: 1,
    name: "Parque Isabel Riquelme",
    position: [-33.483, -70.632],
    icon: createCustomMarker(`${process.env.PUBLIC_URL}/icons/Camioneta.png`),
  },
];

// **Componente para Zoom Personalizado (Horizontal)**
const CustomControls_ = ({
  setTileLayer,
  isHighContrast,
  setIsHighContrast,
  setAllowManualZoom,
}) => {
  const map = useMap();

  const toggleContrast = () => {
    setIsHighContrast(!isHighContrast);
    setTileLayer(isHighContrast ? tileLayers.normal : tileLayers.dark);
  };

  const handleZoomOut = () => {
    setAllowManualZoom(true); // 🚀 Habilita el zoom manual
    map.zoomOut();
  };

  return (
    <div className="contenedorControl" style={{ cursor: "pointer" }}>
      <div className="controlZoom">
        <Add style={{ color: "white" }} onClick={() => map.zoomIn()} />
      </div>
      <div className="controlZoom">
        <Remove style={{ color: "white" }} onClick={handleZoomOut} />
      </div>
      <div
        className="controlStyleAltoContraste2"
        style={{ cursor: "pointer" }}
        onClick={toggleContrast}
      >
        <LightTooltip title="Alto Contraste" placement="right">
          <Contrast style={{ color: isHighContrast ? "#A2A09F" : "white" }} />
        </LightTooltip>
      </div>
    </div>
  );
};

const FloatingBox = () => {
  return (
    <div className="floating-box">
      <div className="box-border"></div>
      <span className="box-text">TERRITORIOS</span>
    </div>
  );
};

const CenterLogger = () => {
  const [center, setCenter] = useState(null);
  const map = useMapEvents({
    moveend: () => {
      const newCenter = map.getCenter();
      setCenter(newCenter);
      console.log("📍 Nueva posición central del mapa:", newCenter);
    },
  });

  return null; // No necesita renderizar nada en pantalla
};

// Definir un icono de prueba
const testIcon = L.icon({
  iconUrl: "https://leafletjs.com/examples/custom-icons/leaf-red.png", // Puedes cambiarlo por cualquier otra URL de imagen
  iconSize: [38, 38],
  iconAnchor: [19, 38], // Ajuste de la base del icono
  popupAnchor: [0, -38], // Ajuste del popup
});

const TestMarker = () => {
  return (
    <Marker position={[-33.47815, -70.64164]} icon={testIcon}>
      <Popup>📍 Marcador con menos decimales</Popup>
    </Marker>
  );
};

function App() {
  const [tileLayer, setTileLayer] = useState(tileLayers.normal);
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [showMarkers, setShowMarkers] = useState(false);
  const [showMarkersFirstLevel, setShowMarkersFirstLevel] = useState(false);
  const [showPanel, setShowPanel] = useState(false);
  const [markersData, setMarkersData] = useState([]);
  const [opcionCategorias, setOpcionCategorias] = useState([]);
  const [opcionTerritorios, setOpcionTerritorios] = useState([]);
  const [selectedTerritory, setSelectedTerritory] = useState(null);
  const [showLabels, setShowLabels] = useState(true);
  const [allowManualZoom, setAllowManualZoom] = useState(false);
  const [filteredMarkers, setFilteredMarkers] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({
    territorio: null,
    categoria: null,
  });
  const hasFetched = useRef(false);
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
    const lastZoom = useRef(null); // Guarda el último nivel de zoom para evitar estados innecesarios

    useEffect(() => {
      const updateMarkersVisibility = () => {
        const currentZoom = map.getZoom();

        // Evitar ejecuciones innecesarias comparando con el último zoom
        if (currentZoom === lastZoom.current) return;
        lastZoom.current = currentZoom; // Actualizamos el zoom solo si cambia

        console.log("zoom effect", currentZoom);

        setShowMarkers((prev) =>
          prev !== currentZoom >= MIN_ZOOM_FOR_MARKERS
            ? currentZoom >= MIN_ZOOM_FOR_MARKERS
            : prev
        );
        setShowMarkersFirstLevel((prev) =>
          prev !== currentZoom <= SHOW_FIRST_LEVEL_MARKERS_ZOOM
            ? currentZoom <= SHOW_FIRST_LEVEL_MARKERS_ZOOM
            : prev
        );
        setShowLabels((prev) =>
          prev !== (currentZoom <= MIN_ZOOM_TO_HIDE_LABELS && currentZoom >= 14)
            ? currentZoom <= MIN_ZOOM_TO_HIDE_LABELS && currentZoom >= 14
            : prev
        );
      };

      // 📌 Ejecutar la función al cargar la página
      updateMarkersVisibility();

      // 📌 Escuchar cambios en el zoom
      map.on("zoomend", updateMarkersVisibility);

      return () => {
        map.off("zoomend", updateMarkersVisibility);
      };
    }, [map]); // ✅ Ahora solo se ejecuta cuando el mapa cambia

    return null;
  }

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;

      readCSVFile()
        .then(({ markers, categoriasUnicas, territoriosUnicos }) => {
          console.log("Marcadores desde archivo", markers);
          console.log("Categorías únicas", categoriasUnicas);
          console.log("Territorios únicos", territoriosUnicos);
          setOpcionTerritorios(territoriosUnicos);
          setOpcionCategorias(categoriasUnicas);
          setMarkersData(markers);
          setFilteredMarkers(markers);
        })
        .catch((error) =>
          console.error("Error leyendo el archivo CSV:", error)
        );
    }
  }, []); // Se ejecuta solo una vez al montar el componente

  // 📌 Lógica de filtrado en tiempo real
  // 📌 Método para filtrar marcadores
  const filtrarMarcadores = (nuevoFiltro) => {
    const filtrosActualizados = { ...selectedFilters, ...nuevoFiltro };
    setSelectedFilters(filtrosActualizados);

    console.log("Filtros actualizados:", filtrosActualizados);

    let filtrados = markersData;
    console.log("Filtrados por territorio:", filtrados);

    if (filtrosActualizados.territorio) {
      filtrados = filtrados.filter(
        (marker) => marker.territorio === filtrosActualizados.territorio.label
      );
    }

    if (filtrosActualizados.categoria) {
      filtrados = filtrados.filter(
        (marker) => marker.categoria === filtrosActualizados.categoria.label
      );
    }

    setFilteredMarkers(filtrados);
  };

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

  const MoveToTerritory = ({
    selectedTerritory,
    allowManualZoom,
    setAllowManualZoom,
  }) => {
    const map = useMap();
    const lastTerritory = useRef("");
    const hasMoved = useRef(false);

    useEffect(() => {
      if (
        !selectedTerritory ||
        selectedTerritory.label === lastTerritory.current ||
        allowManualZoom
      )
        return;

      console.log("🔄 Moviendo al territorio:", selectedTerritory.label);

      const territory = zonas.find(
        (zona) => zona.name === selectedTerritory.label
      );

      if (territory) {
        setAllowManualZoom(false); // ✅ resetea el zoom manual
        const animationDuration = hasMoved.current ? 1.5 : 0.2;

        map.flyTo(territory.center, 16, {
          animate: true,
          duration: animationDuration,
          easeLinearity: 0.8,
        });

        hasMoved.current = true;
        lastTerritory.current = selectedTerritory.label;
      }
    }, [selectedTerritory]);

    return null;
  };

  const ManualZoomHandler = ({ setAllowManualZoom }) => {
    const map = useMap();

    useEffect(() => {
      const handleZoom = () => {
        console.log(
          "🖱️ Zoom manual detectado (scroll del mouse o control de zoom)"
        );
        setAllowManualZoom(true);
      };

      map.on("zoomstart", handleZoom);

      return () => {
        map.off("zoomstart", handleZoom);
      };
    }, [map]);

    return null;
  };

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <div className={`panel-lateral ${!showPanel ? "active" : ""}`}>
        <div
          style={{
            padding: "10px",
            background: "#41307C",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <Tune style={{ color: "white", fontSize: "20px" }} />{" "}
          <span
            style={{
              fontSize: "0.9rem",
              textTransform: "uppercase",
              fontWeight: "600",
            }}
          >
            Filtros
          </span>
        </div>
        {/* <p>Aquí puedes agregar información adicional.</p> */}
        <Row style={{ padding: "20px 14px 20px 14px" }}>
          <CampoDropDownSearchSimple
            PropiedadesCampo={{
              Ancho: 12,
              NombreCampo: "Territorio",
              IdCampo: "Territorio",
              MultiSelect: false,
              Disabled: false,
              Opciones: opcionTerritorios,
              Clearable: false,
              IsSearchable: false,
            }}
            Valor={selectedFilters.territorio}
            OnChange={(e, i) => {
              console.log("e", e);
              console.log("i", i);
              setSelectedTerritory(e);
              filtrarMarcadores({ territorio: e });
              setAllowManualZoom(false);
            }}
          />
          <CampoDropDownSearchSimple
            PropiedadesCampo={{
              Ancho: 12,
              NombreCampo: "Categoría",
              IdCampo: "Categoría",
              MultiSelect: false,
              Disabled: false,
              Opciones: opcionCategorias,
              Clearable: false,
              IsSearchable: false,
            }}
            Valor={selectedFilters.categoria}
            OnChange={(e, i) => {
              console.log("e", e);
              console.log("i", i);
              filtrarMarcadores({ categoria: e });
            }}
          />
        </Row>
      </div>

      <MapContainer
        center={position}
        zoom={14}
        style={{ width: "100%", height: "100%" }}
        zoomControl={false} // **Desactiva el zoom por defecto**
        // maxBounds={[
        //   [-33.52, -70.65],
        //   [-33.47, -70.61],
        // ]}
        maxBounds={[
          [-33.53, -70.66], // 🔽 Más abajo (Sur) y más a la izquierda (Oeste)
          [-33.46, -70.6], // 🔼 Más arriba (Norte) y más a la derecha (Este)
        ]}

        //maxBounds={[[-33.496635599836075, -70.63123226165773]]}
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
          setAllowManualZoom={setAllowManualZoom} // ✅ Pasamos el estado para permitir zoom manual
        />
        <MoveToTerritory
          selectedTerritory={selectedTerritory}
          allowManualZoom={allowManualZoom} // ✅ Lo pasamos para evitar que `flyTo` se active
          setAllowManualZoom={setAllowManualZoom} // ✅ Para resetear el estado si es necesario
        />
        <ManualZoomHandler setAllowManualZoom={setAllowManualZoom} />
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
        {showLabels &&
          zonas.map((zona, index) => (
            <Marker
              key={index}
              position={zona.posicionLabel}
              icon={L.divIcon({
                className: "zone-label",
                html: `<div style='color: rgba(132,55,123, 0.4); font-weight: bold;font-size: 50px ;padding: 4px; border-radius: 4px;'>${zona.name}</div>`,
                //html: `<div style='color: black; font-weight: bold; background: rgba(255,255,255,0.8); padding: 2px 6px 2px 5px; border-radius: 4px;'>${zona.name}</div>`,
                iconSize: [20],
                //iconAnchor: [50, 15],
              })}
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
          ? filteredMarkers.map((marker) => (
              <Marker
                key={marker.id}
                position={marker.position}
                icon={marker.icon}
                eventHandlers={{
                  mouseover: (e) => e.target.openPopup(), // ✅ Abre el popup cuando pasas el mouse
                  mouseout: (e) => e.target.closePopup(), // ✅ Cierra el popup cuando sales
                  click: () => alert(`📌 Has hecho clic en: ${marker.name}`), // ✅ Muestra un alert con el nombre del marcador
                }}
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
        <CenterLogger />
        <TestMarker />
      </MapContainer>
      <FloatingBox />
    </div>
  );
}

export default App;
