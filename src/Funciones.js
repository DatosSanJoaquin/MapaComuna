import L from "leaflet";

export const createCustomMarker = (iconUrl) => {
  return L.divIcon({
    className: "custom-marker",
    html: `
        <div class="marker-container">
          <div class="marker-icon">
            <img src="${iconUrl}" alt="Icono" />
          </div>
        </div>
      `,
    iconSize: [40, 55], // Más alto para dejar espacio a la punta
    iconAnchor: [20, 50], // Ajuste para que la punta toque el suelo
    popupAnchor: [0, -50], // Ajuste del popup
  });
};
