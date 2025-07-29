import React, { useState, useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  useMap,
  Marker,
  Popup,
  useMapEvents,
  Rectangle,
  SVGOverlay,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

import L from "leaflet";
import "./CSS/Estilos.css";
import "./CSS/Paneles.css";
import { createCustomMarker } from "./Funciones";
import "bootstrap/dist/css/bootstrap.min.css";

import {
  Contrast,
  Add,
  Remove,
  Tune,
  DeleteSweep,
  VisibilityOff,
  Info,
  FilterAlt,
} from "@mui/icons-material";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import {
  leerTerritoriosCSV,
  readCSVFile,
  leerMatrizCallesSegmentos,
} from "./Function/readFile";
import { Row, Col, Button } from "react-bootstrap";
import {
  CampoDropDownSearch,
  CampoDropDownSearchSimple,
  SelectWithCheckboxes,
} from "./Function/Campos";
import { ModalInformativo, ModalInformativoCalle } from "./Function/Modal";
import Mapa from "./Mapa";
import ClipLoader from "react-spinners/ClipLoader";

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
const bounds = [
  [-33.495, -70.642], // Esquina superior izquierda
  [-33.49, -70.635], // Esquina inferior derecha
];

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
            [-70.64201411629257, -33.47639996744827],
            [-70.64180532810042, -33.4808503611497],
            [-70.63884549553366, -33.50712583360333],
            [-70.63765558366403, -33.51183593497454],
            [-70.63640861295742, -33.518700887015356],
            [-70.6271764800038, -33.51781927438055],
            [-70.61997642068849, -33.514460925875056],
            [-70.61495942752148, -33.513181369188985],
            [-70.61128801139509, -33.5132070433919],
            [-70.61144284702328, -33.51072474459925],
            [-70.61386408732976, -33.50814928706223],
            [-70.61702604994387, -33.495069568528535],
            [-70.61780106389324, -33.49187399545365],
            [-70.61869468468916, -33.487578047950215],
            [-70.61878854310102, -33.48709375313862],
            [-70.62011269141621, -33.48529329989017],
            [-70.62409760071685, -33.47044509954799],
            [-70.6243224445301, -33.47013676154911],
            [-70.62458948102652, -33.46987452513517],
            [-70.62571077023392, -33.469114051685885],
            [-70.62681150516272, -33.470907426376876],
            [-70.62680800308587, -33.471289143749274],
            [-70.62711852480977, -33.4716539225158],
            [-70.63519594793088, -33.4747213410299],
            [-70.63915369355523, -33.4760353846265],
            [-70.63986424862009, -33.4762297501799],
            [-70.64036271081206, -33.47630959445705],
            [-70.64201411629257, -33.47639996744827],
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
            [-70.64180561901266, -33.48085173392732],
            [-70.61869656249225, -33.48757886437849],
            [-70.61878844241785, -33.487094466018306],
            [-70.62011291315923, -33.48529243757405],
            [-70.62409802808347, -33.47044379284774],
            [-70.6243206589225, -33.47013836251495],
            [-70.62458947119997, -33.469875161402406],
            [-70.62570751527534, -33.46910906377982],
            [-70.62681060639986, -33.47090844343001],
            [-70.62680860396017, -33.471291588300836],
            [-70.62711689330114, -33.47165229448028],
            [-70.63524082631676, -33.47473282306617],
            [-70.6391962960063, -33.47605102664345],
            [-70.6398629352126, -33.47622920048732],
            [-70.64036848671506, -33.47631009933802],
            [-70.6420114053574, -33.47640171736277],
            [-70.64180561901266, -33.48085173392732],
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
    center: [-33.47831921122101, -70.6263828277588],
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
    posicionLabel: [-33.488146199048536, -70.62165711212262],
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

const ZoneLabels = () => {
  const map = useMap();
  const [zoomLevel, setZoomLevel] = useState(map.getZoom());

  useEffect(() => {
    const updateZoom = () => {
      setZoomLevel(map.getZoom());
    };

    map.on("zoomend", updateZoom);
    return () => {
      map.off("zoomend", updateZoom);
    };
  }, [map]);

  return (
    <>
      {zonas.map((zona, index) => {
        // 📌 Variables de tamaño y opacidad
        let fontSize;
        let opacity;

        if (zoomLevel >= 14) {
          // 🔹 Cuando el zoom es 14 o mayor, los números crecen progresivamente
          fontSize = 50 + (zoomLevel - 13) * 5;
          opacity = Math.max(0.2, 1 - (zoomLevel - 14) * 0.2);
        } else {
          // 🔹 Cuando el zoom es menor a 14, reducción MUY agresiva
          fontSize = Math.max(2, 50 - (14 - zoomLevel) * 15); // 🔥 Llega hasta 2px
          opacity = 1; // Mantiene opacidad máxima para que no desaparezca
        }

        return (
          <Marker
            key={index}
            position={zona.posicionLabel}
            interactive={false}
            icon={L.divIcon({
              className: "zone-label",
              html: `<div style="
                font-size: ${fontSize}px;
                opacity: ${opacity};
                font-weight: bold;
                color: rgb(237, 103, 23, 0.5);
                text-align: center;
      pointer-events: none;">${zona.name}</div>`, // 🚀 Bloqueamos eventos

              iconSize: [20],
            })}
          />
        );
      })}
    </>
  );
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

function App() {
  const [tileLayer, setTileLayer] = useState(tileLayers.normal);
  const [isHighContrast, setIsHighContrast] = useState(false);
  //const [showMarkers, setShowMarkers] = useState(false);
  const [showMarkers, setShowMarkers] = useState(true);
  const [showPanel, setShowPanel] = useState(false);
  const [showPanelTerritorios, setShowPanelTerritorios] = useState(false);
  const [showPanelInformativo, setShowPanelInformativo] = useState(false);
  const [showModalCalle, setShowModalCalle] = useState(false);
  const [informacionModalCalle, setInformacionModalCalle] = useState(null);
  const [informacionMarker, setInformacionMarker] = useState(null);

  //STATE DE MATRICES
  const [markersData, setMarkersData] = useState([]);
  const [informacionTerritorios, setInformacionTerritorios] = useState([]);
  const [callesSegmentos, setCallesSegmentos] = useState([]);
  //

  const [territorioSeleccionado, setTerritorioSeleccionado] = useState(null);
  const [opcionCategorias, setOpcionCategorias] = useState([]);
  const [opcionTerritorios, setOpcionTerritorios] = useState([]);
  const [selectedTerritory, setSelectedTerritory] = useState(null);
  const [allowManualZoom, setAllowManualZoom] = useState(false);
  const [filteredMarkers, setFilteredMarkers] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({
    territorio: null,
    categoria: [],
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

  const [isLoading, setIsLoading] = useState(false);

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

      leerTerritoriosCSV()
        .then(({ territorios }) => {
          console.log("Territorios desde archivo", territorios);
          setInformacionTerritorios(territorios);
        })
        .catch((error) =>
          console.error("Error leyendo el archivo CSV Territorio:", error)
        );

      leerMatrizCallesSegmentos()
        .then(({ matrizCallesSegmentos }) => {
          console.log("Calles Segmentos desde archivo", matrizCallesSegmentos);
          setCallesSegmentos(matrizCallesSegmentos);
        })
        .catch((error) =>
          console.error("Error leyendo el archivo CSV Territorio:", error)
        );
    }
  }, []); // Se ejecuta solo una vez al montar el componente

  const getCategoriaIcon = (nombreCategoria) => {
    const iconMap = {
      seguridad: "fas fa-shield-alt",
      aseo: "fas fa-recycle",
      reciclaje: "fas fa-recycle",
      salud: "fas fa-heartbeat",
      "personas mayores": "fas fa-users",
      mayor: "fas fa-users",
      educación: "fas fa-graduation-cap",
      deporte: "fas fa-running",
      cultura: "fas fa-theater-masks",
      transporte: "fas fa-bus",
      vivienda: "fas fa-home",
      trabajo: "fas fa-briefcase",
      economía: "fas fa-chart-line",
      "medio ambiente": "fas fa-leaf",
      infraestructura: "fas fa-tools",
    };

    const categoria = Object.keys(iconMap).find((key) =>
      nombreCategoria.toLowerCase().includes(key)
    );

    return iconMap[categoria] || "fas fa-info-circle";
  };

  const getInformacionTerritorio = (territorio) => {
    console.warn("Territorio seleccionado:", territorio);

    let numeroTerritorio = territorio?.label;

    if (numeroTerritorio) {
      const territorioEncontrado = informacionTerritorios.find(
        (t) => t.territorio === numeroTerritorio
      );

      if (territorioEncontrado) {
        console.log("Información del territorio:", territorioEncontrado);
        setTerritorioSeleccionado(territorioEncontrado);
      } else {
        console.warn("Territorio no encontrado");
      }
    }
  };

  const actualizarFiltros = (nuevoFiltro) => {
    const filtrosActualizados = { ...selectedFilters, ...nuevoFiltro };
    setSelectedFilters(filtrosActualizados);
  };

  const filtrarMarcadores = () => {
    let filtros_ = selectedFilters;

    console.log("Filtros aplicados:", filtros_);

    if (filtros_.territorio !== undefined) {
      setSelectedTerritory(filtros_.territorio);
    }

    const territorioSeleccionado = filtros_.territorio;
    const categoriasSeleccionadas = filtros_.categoria || [];

    let filtrados = markersData;

    if (territorioSeleccionado) {
      filtrados = filtrados.filter(
        (marker) => marker.territorio === territorioSeleccionado.label
      );

      getInformacionTerritorio(filtros_.territorio);
    }

    if (categoriasSeleccionadas.length > 0) {
      const categoriasLabels = categoriasSeleccionadas.map((c) => c.label);
      filtrados = filtrados.filter((marker) =>
        categoriasLabels.includes(marker.categoria)
      );
    }

    setFilteredMarkers(filtrados);

    if (filtros_.territorio) {
      setShowPanelTerritorios(true);
      setShowPanel(false);
    }
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

  const MostrarModalInformativo = (marker) => {
    setShowPanelInformativo(!showPanelInformativo);
    console.log("informacion marker", marker);
    setInformacionMarker(marker);
  };

  const MostrarModalInformativoCalle = (info) => {
    console.log("informacion calle", info);

    setInformacionModalCalle(info);
    setShowModalCalle(true);
  };

  const mostrarPanel = () => {
    setShowPanel(!showPanel);
  };

  const mostrarPanelTerritorios = () => {
    setShowPanelTerritorios(!showPanelTerritorios);
  };

  const limpiarFiltros = () => {
    setIsLoading(true); // 🔄 Mostrar spinner y overlay
    setShowPanelTerritorios(false); // Ocultar panel lateral
    setShowPanel(false); // Ocultar filtro

    // Opcional: quitar momentáneamente los marcadores
    setFilteredMarkers([]);

    setTimeout(() => {
      setSelectedFilters({ territorio: null, categoria: [] });
      setSelectedTerritory(null);
      setTerritorioSeleccionado(null);

      // Restaurar marcadores después del "limpio"
      setFilteredMarkers(markersData);
      setIsLoading(false); // 🔚 Ocultar spinner y dejar mapa limpio
    }, 900); // Ajusta el tiempo según lo que necesites
  };

  return (
    <>
      <div style={{ width: "100vw", height: "100vh" }}>
        <div
          className={`panel-lateral modern-filter-panel ${
            !showPanel ? "active" : ""
          }`}
        >
          {/* Header modernizado */}
          <div className="modern-filter-header">
            <div className="filter-header-content">
              <div className="filter-icon-section">
                <div className="filter-icon-wrapper">
                  <Tune className="filter-panel-icon" />
                </div>
                <div className="filter-header-text">
                  <h3 className="filter-panel-title">Filtros</h3>
                  <p className="filter-panel-subtitle">
                    Personaliza tu búsqueda
                  </p>
                </div>
              </div>
              <button
                className="filter-hide-button"
                onClick={() => setShowPanel(!showPanel)}
              >
                <span>Ocultar</span>
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>

          {/* Contenido de filtros modernizado */}
          <div className="modern-filter-content">
            <div className="filter-form-container">
              {/* Campo Territorio */}
              <div className="filter-field-group">
                <div className="filter-field-header">
                  <div className="filter-field-icon">
                    <i className="fas fa-map-marked-alt"></i>
                  </div>
                  <label className="filter-field-label">Territorio</label>
                </div>
                <div className="filter-field-wrapper">
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
                      actualizarFiltros({ territorio: e });
                      setAllowManualZoom(false);
                    }}
                  />
                </div>
              </div>

              {/* Campo Categoría */}
              <div className="filter-field-group">
                <div className="filter-field-header">
                  <div className="filter-field-icon">
                    <i className="fas fa-tags"></i>
                  </div>
                  <label className="filter-field-label">Categoría</label>
                </div>
                <div className="filter-field-wrapper">
                  <CampoDropDownSearch
                    PropiedadesCampo={{
                      Ancho: 12,
                      NombreCampo: "Categoría",
                      IdCampo: "Categoría",
                      MultiSelect: true,
                      Disabled: false,
                      Opciones: opcionCategorias,
                      Clearable: false,
                      IsSearchable: false,
                    }}
                    Valor={selectedFilters.categoria}
                    OnChange={(e, i) => {
                      console.log("e", e);
                      console.log("i", i);
                      actualizarFiltros({ categoria: e });
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Botones de acción modernizados */}
            <div className="filter-actions">
              <button
                className="modern-filter-btn apply-filter"
                onClick={() => filtrarMarcadores()}
                disabled={
                  selectedFilters.territorio == null &&
                  selectedFilters.categoria.length === 0
                }
              >
                <i className="fas fa-filter"></i>
                <span>Filtrar</span>
              </button>

              <button
                className="modern-filter-btn clear-filter"
                onClick={() => limpiarFiltros()}
              >
                <i className="fas fa-broom"></i>
                <span>Limpiar</span>
              </button>
            </div>
          </div>
        </div>

        <div
          className={`panel-izquierdo modern-panel ${
            !showPanelTerritorios ? "active" : ""
          }`}
        >
          {/* Header modernizado */}
          <div className="modern-panel-header">
            <div className="header-content">
              <div className="header-icon-section">
                <div className="icon-wrapper-panel">
                  <Info className="panel-icon" />
                </div>
                <div className="header-text">
                  <h3 className="panel-title">
                    Información Territorio{" "}
                    {territorioSeleccionado
                      ? territorioSeleccionado.territorio
                      : ""}
                  </h3>
                  <p className="panel-subtitle">
                    Datos y estadísticas del sector
                  </p>
                </div>
              </div>
              <button
                className="hide-button"
                onClick={() => setShowPanelTerritorios(!showPanelTerritorios)}
              >
                <span>Ocultar</span>
                <i className="fas fa-chevron-left"></i>
              </button>
            </div>
          </div>

          {/* Contenido modernizado */}
          <div className="modern-panel-content">
            {territorioSeleccionado ? (
              <div className="categorias-container">
                {territorioSeleccionado.categorias.map((categoria, index) => (
                  <div className="categoria-card" key={index}>
                    <div className="categoria-header">
                      <div className="categoria-icon">
                        <i className={getCategoriaIcon(categoria.nombre)}></i>
                      </div>
                      <h4 className="categoria-title">{categoria.nombre}</h4>
                    </div>

                    <div className="categoria-content">
                      <div className="info-list">
                        {categoria.informacion.split("\n").map((linea, i) => (
                          <div className="info-item-panel" key={i}>
                            <div className="bullet-point"></div>
                            <span className="info-text">{linea}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">
                  <i className="fas fa-map-marked-alt"></i>
                </div>
                <h4 className="empty-title">Selecciona un territorio</h4>
                <p className="empty-description">
                  Elige un territorio en el mapa para ver información detallada
                  y estadísticas
                </p>
              </div>
            )}
          </div>
        </div>

        <Mapa
          position={[-33.488, -70.625]}
          zonas={zonas}
          sanJoaquinGeoJSON={sanJoaquinGeoJSON}
          estilosZonas={estilosZonas}
          filteredMarkers={filteredMarkers}
          selectedTerritory={selectedTerritory}
          allowManualZoom={allowManualZoom}
          setAllowManualZoom={setAllowManualZoom}
          MostrarModalInformativo={MostrarModalInformativo}
          MostrarModalInformativoCalle={MostrarModalInformativoCalle}
          ShowPanel={mostrarPanel}
          ShowPanelInfoTerritorios={mostrarPanelTerritorios}
          CallesSegmentos={callesSegmentos}
        />
        {/* 📌 Definir patrón de líneas verticales como SVG */}

        <FloatingBox />
        {isLoading && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              backgroundColor: "rgba(0, 0, 0, 0.5)", // Fondo oscuro semitransparente
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 9999,
            }}
          >
            <ClipLoader color="#ffffff" size={60} />
            <div
              style={{
                marginTop: "7px",
                marginLeft: "9px",
                color: "#ffffff",
                fontSize: "18px",
              }}
            >
              Cargando Mapa...
            </div>
          </div>
        )}
      </div>
      {showPanelInformativo && (
        <ModalInformativo
          show={showPanelInformativo}
          handleClose={() => setShowPanelInformativo(false)}
          informacion={informacionMarker}
        />
      )}
      <ModalInformativoCalle
        show={showModalCalle}
        handleClose={() => setShowModalCalle(false)}
        informacion={informacionModalCalle}
      />
    </>
  );
}

export default App;
