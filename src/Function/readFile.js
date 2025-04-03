import Papa from "papaparse";
import { createCustomMarker } from "../Funciones";

const FILE_PATH = `${process.env.PUBLIC_URL}/data/datos1.csv`;

export const readCSVFile = async () => {
  return new Promise((resolve, reject) => {
    fetch(FILE_PATH)
      .then((response) => response.text())
      .then((csvText) => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (result) => {
            let idCounter = 1;
            let categoriasArray = [];
            let territoriosArray = [];

            const markers = result.data
              .filter((row) => {
                const entries = Object.entries(row).filter(
                  ([key, val]) =>
                    key &&
                    !key.startsWith("Unnamed") &&
                    String(val).trim() !== ""
                );
                return entries.length > 0;
              })
              .map((row) => {
                // Reemplaza campos vacíos con "No disponible", excepto la foto
                const cleanRow = {};
                Object.keys(row).forEach((key) => {
                  if (key === "Foto (Si aplica)**") {
                    cleanRow[key] = row[key];
                  } else {
                    cleanRow[key] =
                      row[key] && String(row[key]).trim() !== ""
                        ? String(row[key]).trim()
                        : "No disponible";
                  }
                });

                // Validación de coordenadas
                const coordString =
                  cleanRow["Coordenadas (click derecho en maps)"];
                let position = [0, 0]; // valor por defecto

                if (coordString && coordString.includes(",")) {
                  const parts = coordString
                    .split(",")
                    .map((coord) => parseFloat(coord.trim()));
                  if (parts.length === 2 && parts.every((num) => !isNaN(num))) {
                    position = parts;
                  } else {
                    console.warn(
                      `Coordenadas inválidas para: ${cleanRow["Nombre"]}`,
                      coordString
                    );
                  }
                } else {
                  console.warn(
                    `Campo de coordenadas vacío o mal formado para: ${cleanRow["Nombre"]}`
                  );
                }

                // Categoría única
                const categoria = {
                  value: cleanRow["Categoría"],
                  label: cleanRow["Categoría"],
                };
                if (
                  !categoriasArray.some((cat) => cat.value === categoria.value)
                ) {
                  categoriasArray.push(categoria);
                }

                // Territorio único
                const territorio = {
                  value: cleanRow["Territorio (1 al 7)"],
                  label: cleanRow["Territorio (1 al 7)"],
                };
                if (
                  !territoriosArray.some(
                    (terr) => terr.value === territorio.value
                  )
                ) {
                  territoriosArray.push(territorio);
                }

                return {
                  id: idCounter++,
                  direccion: cleanRow["Dirección"],
                  name: cleanRow["Nombre"],
                  position: position,
                  icon: createCustomMarker(
                    `${process.env.PUBLIC_URL}/icons/marcadores/${cleanRow["Icono (JPG o PNG)"]}`
                  ),
                  categoria: cleanRow["Categoría"],
                  territorio: cleanRow["Territorio (1 al 7)"],
                  link:
                    cleanRow["Link (si aplica)"] !== "No disponible"
                      ? cleanRow["Link (si aplica)"]
                      : null,
                  foto: cleanRow["Foto (Si aplica)**"]
                    ? `${process.env.PUBLIC_URL}/images/${cleanRow[
                        "Foto (Si aplica)**"
                      ].trim()}`
                    : `${process.env.PUBLIC_URL}/images/No disponible.jpg`,
                  descripcion: cleanRow["Descripción"],
                  subcategoria: cleanRow["Subcategoría?"],
                };
              });

            resolve({
              markers,
              categoriasUnicas: categoriasArray,
              territoriosUnicos: territoriosArray,
            });
          },
          error: (err) => reject(err),
        });
      })
      .catch((error) => reject(error));
  });
};
