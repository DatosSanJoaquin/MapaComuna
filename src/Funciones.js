// import L from "leaflet";

// export const createCustomMarker = (iconUrl) => {
//   return L.divIcon({
//     className: "custom-marker",
//     html: `
//         <div class="marker-container">
//           <div class="marker-icon">
//             <img src="${iconUrl}" alt="Icono" />
//           </div>
//         </div>
//       `,
//     iconSize: [40, 55], // Más alto para dejar espacio a la punta
//     iconAnchor: [20, 50], // Ajuste para que la punta toque el suelo
//     popupAnchor: [0, -50], // Ajuste del popup
//   });
// };

import L from "leaflet";

const iconCache = new Map();

export function createCustomMarker(iconUrl, size = [40, 55]) {
  const cacheKey = `div-${iconUrl}`;

  if (!iconCache.has(cacheKey)) {
    const icon = L.divIcon({
      className: "custom-marker",
      html: `
        <div class="marker-container">
          <div class="marker-icon">
            <img src="${iconUrl}" alt="Icono" />
          </div>
        </div>
      `,
      iconSize: size,
      iconAnchor: [size[0] / 2, size[1] - 5],
      popupAnchor: [0, -size[1] + 5],
    });

    iconCache.set(cacheKey, icon);
  }

  return iconCache.get(cacheKey);
}

const estiloCache = new Map();

export const getCalleStyle = (estado) => {
  if (estiloCache.has(estado)) return estiloCache.get(estado);

  let estilo;
  switch (estado) {
    case "Proyecto":
      estilo = {
        color: "transparent",
        fillColor: "rgba(0, 255, 0, 0.5)",
        weight: 0,
        fillOpacity: 0.5,
      };
      break;
    case "Pavimentación":
      estilo = {
        color: "rgba(48, 39, 175, 0.2)",
        fillColor: "rgba(48, 39, 175, 0.8)",
        weight: 1,
        fillPattern: true,
      };
      break;
    case "Reparación de Veredas":
      estilo = { color: "#5D428B", fillColor: "rgb(157, 137, 191)", weight: 2 };
      break;
    default:
      estilo = {
        color: "gray",
        fillColor: "rgba(128, 128, 128, 0.5)",
        weight: 2,
      };
  }

  estiloCache.set(estado, estilo);
  return estilo;
};

export const getHoverHandler = (estado) => ({
  mouseover: (e) => {
    e.target.openTooltip();
    e.target.setStyle({ weight: 3 });
  },
  mouseout: (e) => {
    e.target.closeTooltip();
    e.target.setStyle(getCalleStyle(estado));
  },
  click: (e) => {
    e.originalEvent.preventDefault(); // Evita selección predeterminada
    e.target.setStyle(getCalleStyle(estado)); // Evita que el borde cambie al hacer clic
  },
});
