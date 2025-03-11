import Papa from "papaparse";
import { createCustomMarker } from "../Funciones";

const FILE_PATH = `${process.env.PUBLIC_URL}/data/datos.csv`;

export const readCSVFile = async () => {
  return new Promise((resolve, reject) => {
    fetch(FILE_PATH)
      .then((response) => response.text())
      .then((csvText) => {
        Papa.parse(csvText, {
          header: true, // Lee los encabezados del archivo
          skipEmptyLines: true,
          complete: (result) => {
            let idCounter = 1; // Generar IDs automáticamente
            let categoriasArray = []; // Almacena todas las categorías
            let territoriosArray = []; // Almacena todas las zonas

            // Convertir cada fila en un marcador
            const markers = result.data.map((row) => {
              const categoria = {
                value: row["Categoría"],
                label: row["Categoría"],
              };
              // Agregar solo si no existe en el array
              if (
                !categoriasArray.some((cat) => cat.value === categoria.value)
              ) {
                categoriasArray.push(categoria);
              }

              const territorio = {
                value: `${row["Territorio (1 al 7)"]}`,
                label: `${row["Territorio (1 al 7)"]}`,
              };

              // Agregar solo si no existe en el array
              if (
                !territoriosArray.some(
                  (terr) => terr.value === territorio.value
                )
              ) {
                territoriosArray.push(territorio);
              }

              return {
                id: idCounter++, // Genera un ID autoincremental
                direccion: row["Dirección"],
                name: row["Nombre"],
                position: row["Coordenadas (click derecho en maps)"]
                  .split(",") // Divide en latitud y longitud
                  .map((coord) => parseFloat(coord.trim())), // Limpia espacios y convierte a número
                icon: createCustomMarker(
                  `${process.env.PUBLIC_URL}/icons/marcadores/${row["Icono (JPG o PNG)"]}`
                ),
                categoria: row["Categoría"], // Para filtrar
                territorio: `${row["Territorio (1 al 7)"]}`, // Coincide con zonas del mapa
                link: row["Link (si aplica)"] || null,
                foto: row["Foto (Si aplica)**"]
                  ? `${process.env.PUBLIC_URL}/images/${row[
                      "Foto (Si aplica)**"
                    ].trim()}`
                  : `${process.env.PUBLIC_URL}/images/No disponible.jpg`,
              };
            });

            // Resolver con los marcadores y las categorías únicas
            resolve({
              markers,
              categoriasUnicas: categoriasArray,
              territoriosUnicos: territoriosArray,
            });
          },
        });
      })
      .catch((error) => reject(error));
  });
};
