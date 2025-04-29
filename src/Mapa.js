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
  Polygon,
} from "react-leaflet";
import {
  Contrast,
  Add,
  Remove,
  Tune,
  DeleteSweep,
  Info,
} from "@mui/icons-material";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import { readCSVFile } from "./Function/readFile";
import { Row, Col, Button } from "react-bootstrap";
import L from "leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import { useMemo } from "react";
import { getHoverHandler, getCalleStyle } from "./Funciones"; // Asegúrate de importar la función getCalleStyle

function Mapa(props) {
  // Estilos de mapas disponibles
  const tileLayers = {
    normal: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    dark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", // Alto contraste real
  };

  const {
    position,
    zonas,
    sanJoaquinGeoJSON,
    estilosZonas,
    filteredMarkers,
    selectedTerritory,
    allowManualZoom,
    setAllowManualZoom,
    MostrarModalInformativo,
    ShowPanel,
    ShowPanelInfoTerritorios,
    CallesSegmentos,
  } = props;

  const [showMarkers, setShowMarkers] = useState(true);
  const [tileLayer, setTileLayer] = useState(tileLayers.normal);
  const [isHighContrast, setIsHighContrast] = useState(false);

  const MarkerVisibilityController = () => {
    const map = useMap();
    //const lastZoom = useRef(null);

    useEffect(() => {
      const currentZoom = map.getZoom();
      console.log("zoom effect", currentZoom);
      setShowMarkers(true); // ✅ Mantener siempre visibles los marcadores
      console.log("calles segmentos", CallesSegmentos);
    }, [map]);

    return null;
  };

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
        //setAllowManualZoom(false); // ✅ resetea el zoom manual
        const animationDuration = hasMoved.current ? 1.5 : 0;

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

  function CustomTopRightButton() {
    return (
      <div
        className="top-right-button"
        onClick={() => ShowPanel()}
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

  function CustomTopLeftButton() {
    return (
      <div
        className="top-left-button"
        onClick={() => ShowPanelInfoTerritorios()}
        style={{
          cursor: "pointer",
        }}
      >
        {/* <button className="map-button">🔘</button> */}
        <LightTooltip title="Información Territorio" placement="left">
          <Info style={{ color: "white" }} />
        </LightTooltip>
      </div>
    );

    //5D428B
  }

  const callesEnReparacion = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {
          nombre: "Calle en reparación 1",
          descripcion: "Trabajos en la vía: reparación de pavimento",
          estado: "Pavimentación",
        },
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [-70.63922212577691, -33.48853514789772],
              [-70.63570609788977, -33.489617895671024],
              [-70.63567555029688, -33.48955930025526],
              [-70.63918852342515, -33.488481647068646],
            ],
          ],
        },
      },
      {
        type: "Feature",
        properties: {
          nombre: "Calle en reparación 2",
          descripcion: "Reparación de Veredas",
          estado: "Reparación de Veredas",
        },
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [-70.62470154719018, -33.50039546780977],
              [-70.6238593111893, -33.504587708983],
              [-70.62370382146582, -33.504587708983],
              [-70.62455901494384, -33.500384662802404],
            ],
          ],
        },
      },
      {
        type: "Feature",
        properties: {
          nombre: "Calle en reparación 3",
          descripcion: "Proyecto Aceras Calle Primero de Mayo",
          estado: "Proyecto",
        },
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [-70.62432835846798, -33.49027337203907],
              [-70.62400712780602, -33.49173405142709],
              [-70.62386180917358, -33.491714916048],
              [-70.62421363323163, -33.49026699347318],
            ],
          ],
        },
      },
      {
        type: "Feature",
        properties: {
          nombre: "Calle en reparación 3",
          descripcion: "Proyecto Aceras Calle el Pinar",
          estado: "Proyecto",
        },
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [-70.62401477615673, -33.49164475295804],
              [-70.62653108300715, -33.4916638883521],
              [-70.62653108300715, -33.491753186801596],
              [-70.62399947945894, -33.49174042988618],
            ],
          ],
        },
      },
    ],
  };

  const CallesReparacionLayer = () => {
    const map = useMap();

    return (
      <GeoJSON
        data={callesEnReparacion}
        style={(feature) => ({
          ...getCalleStyle(feature.properties.estado),
          interactive: true, // Asegura que los eventos del mouse sigan funcionando
        })}
        onEachFeature={(feature, layer) => {
          if (feature.properties && feature.properties.descripcion) {
            layer.bindTooltip(feature.properties.descripcion, {
              permanent: false,
              direction: "top",
              opacity: 0.9,
              className: "custom-tooltip",
            });
          }

          const hoverEvents = getHoverHandler(feature.properties.estado);

          layer.on({
            ...hoverEvents,
            click: (e) => {
              e.originalEvent.preventDefault();
              e.target.setStyle(getCalleStyle(feature.properties.estado));
            },
          });
        }}
      />
    );
  };

  const construirGeoJSONDesdeSegmentos = (segmentos) => {
    return {
      type: "FeatureCollection",
      features: segmentos.map((item) => ({
        type: "Feature",
        properties: {
          nombre: item.nombre,
          descripcion: item.descripcion,
          estado: item.estado,
        },
        geometry: {
          type: "Polygon",
          coordinates: [item.coordenadas],
        },
      })),
    };
  };

  const fondoGris = useMemo(() => {
    if (!sanJoaquinGeoJSON?.features?.length) return null;

    return {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
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
    };
  }, [sanJoaquinGeoJSON]);

  const CallesSegmentosLayer = ({ segmentos }) => {
    const geojsonData = useMemo(() => {
      if (!segmentos || segmentos.length === 0) return null;
      return construirGeoJSONDesdeSegmentos(segmentos);
    }, [segmentos]);

    if (!geojsonData) return null;
    return (
      <GeoJSON
        data={geojsonData}
        style={(feature) => ({
          ...getCalleStyle(feature.properties.estado),
          interactive: true,
        })}
        onEachFeature={(feature, layer) => {
          if (feature.properties && feature.properties.descripcion) {
            layer.bindTooltip(feature.properties.descripcion, {
              permanent: false,
              direction: "top",
              opacity: 0.9,
              className: "custom-tooltip",
            });
          }

          layer.on({
            mouseover: (e) => {
              e.target.openTooltip();
              e.target.setStyle({
                weight: 3,
              });
            },
            mouseout: (e) => {
              e.target.closeTooltip();
              e.target.setStyle(getCalleStyle(feature.properties.estado));
            },
            click: (e) => {
              e.originalEvent.preventDefault();
              e.target.setStyle(getCalleStyle(feature.properties.estado));
            },
          });
        }}
      />
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

  // const ZoneLabels = () => {
  //   const map = useMap();
  //   const [zoomLevel, setZoomLevel] = useState(map.getZoom());

  //   useEffect(() => {
  //     const updateZoom = () => {
  //       setZoomLevel(map.getZoom());
  //     };

  //     map.on("zoomend", updateZoom);
  //     return () => {
  //       map.off("zoomend", updateZoom);
  //     };
  //   }, [map]);

  //   return (
  //     <>
  //       {zonas.map((zona, index) => {
  //         // 📌 Variables de tamaño y opacidad
  //         let fontSize;
  //         let opacity;

  //         if (zoomLevel >= 14) {
  //           // 🔹 Cuando el zoom es 14 o mayor, los números crecen progresivamente
  //           fontSize = 50 + (zoomLevel - 13) * 5;
  //           opacity = Math.max(0.2, 1 - (zoomLevel - 14) * 0.2);
  //         } else {
  //           // 🔹 Cuando el zoom es menor a 14, reducción MUY agresiva
  //           fontSize = Math.max(2, 50 - (14 - zoomLevel) * 15); // 🔥 Llega hasta 2px
  //           opacity = 1; // Mantiene opacidad máxima para que no desaparezca
  //         }

  //         return (
  //           <Marker
  //             key={index}
  //             position={zona.posicionLabel}
  //             interactive={false}
  //             icon={L.divIcon({
  //               className: "zone-label",
  //               html: `<div style="
  //                 font-size: ${fontSize}px;
  //                 opacity: ${opacity};
  //                 font-weight: bold;
  //                 color: rgb(237, 103, 23, 0.5);
  //                 text-align: center;
  //       pointer-events: none;">${zona.name}</div>`, // 🚀 Bloqueamos eventos

  //               iconSize: [20],
  //             })}
  //           />
  //         );
  //       })}
  //     </>
  //   );
  // };

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

    const labelMarkers = useMemo(() => {
      return zonas.map((zona, index) => {
        let fontSize;
        let opacity;

        if (zoomLevel >= 14) {
          fontSize = 50 + (zoomLevel - 13) * 5;
          opacity = Math.max(0.2, 1 - (zoomLevel - 14) * 0.2);
        } else {
          fontSize = Math.max(2, 50 - (14 - zoomLevel) * 15);
          opacity = 1;
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
                pointer-events: none;">${zona.name}</div>`,
              iconSize: [20],
            })}
          />
        );
      });
    }, [zonas, zoomLevel]); // ✅ Se recalcula solo si cambia el zoom o las zonas

    return <>{labelMarkers}</>;
  };

  return (
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
        [-33.53, -70.647], // 🔽 Más abajo (Sur) y más a la izquierda (Oeste)
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
      {/* <MoveToTerritory
        selectedTerritory={selectedTerritory}
        allowManualZoom={allowManualZoom} // ✅ Lo pasamos para evitar que `flyTo` se active
        setAllowManualZoom={setAllowManualZoom} // ✅ Para resetear el estado si es necesario
      /> */}
      <ManualZoomHandler setAllowManualZoom={setAllowManualZoom} />
      {/* Zoom manual (horizontal) */}
      {/* <HighContrastToggle
              setTileLayer={setTileLayer}
              isHighContrast={isHighContrast}
              setIsHighContrast={setIsHighContrast}
            /> */}
      {/* Área fuera de los límites de San Joaquín (gris) */}
      <CustomTopRightButton />
      <CustomTopLeftButton />
      {fondoGris && (
        <GeoJSON
          data={fondoGris}
          style={{
            fillColor: "#d3d3d3",
            color: "none",
            weight: 0,
            fillOpacity: 0.7,
          }}
        />
      )}
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
      {/* Calles en reparación */}
      {/* <GeoJSON data={callesEnReparacion} style={() => estiloCalles} /> */}
      {/* <PatternedGeoJSON data={callesEnReparacion} /> */}
      {/* <CallesReparacionLayer /> */}
      {/* <GeoJSON data={callesEnReparacion} style={() => estiloCalles} /> */}
      {/* 🟢 Zona 1 dentro de San Joaquín */}
      {/* <GeoJSON
              data={zona1GeoJSON}
              style={zona1Style}
              eventHandlers={{
                mouseover: onMouseOver,
                mouseout: onMouseOut,
              }}
            /> */}

      {/* <CallesReparacionLayer /> */}
      {CallesSegmentos?.length > 0 && (
        <CallesSegmentosLayer segmentos={props.CallesSegmentos} />
      )}

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
      {/* <MarkerVisibilityController /> */}

      {/* 📍 Renderizar los marcadores solo si `showMarkers` es true */}

      {showMarkers ? (
        <MarkerClusterGroup
          maxClusterRadius={30}
          spiderfyOnMaxZoom={true}
          showCoverageOnHover={false}
          chunkedLoading={true}
        >
          {filteredMarkers.map((marker) => (
            <Marker
              key={marker.id}
              position={marker.position}
              icon={marker.icon}
              eventHandlers={{
                mouseover: (e) => e.target.openPopup(),
                mouseout: (e) => e.target.closePopup(),
                click: () => MostrarModalInformativo(marker),
              }}
            >
              <Popup className="custom-popup">{marker.name}</Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      ) : null}

      <CenterLogger />
      {/* <TestMarker /> */}
      <ZoneLabels />

      {/* 📌 Agregamos el patrón SVG sobre el mapa */}
    </MapContainer>
  );
}

export default React.memo(Mapa);
