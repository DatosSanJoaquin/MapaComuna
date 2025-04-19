import Papa from "papaparse";
import { createCustomMarker } from "../Funciones";

const FILE_PATH = `${process.env.PUBLIC_URL}/data/Marcadores.csv`;

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
            //const iconCache = new Set();

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

                // 🔥 Precarga de ícono
                const iconPath = `${process.env.PUBLIC_URL}/icons/marcadores/${cleanRow["Icono (JPG o PNG)"]}`;
                // if (!iconCache.has(iconPath)) {
                //   const img = new Image();
                //   img.src = iconPath;
                //   iconCache.add(iconPath);
                // }

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
                  urlIcon: `${process.env.PUBLIC_URL}/icons/marcadores/${cleanRow["Icono (JPG o PNG)"]}`,
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
                    : `${process.env.PUBLIC_URL}/images/No disponible.png`,
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

export const leerTerritoriosCSV = async () => {
  return new Promise((resolve, reject) => {
    fetch(process.env.PUBLIC_URL + "/data/Territorios.csv")
      .then((response) => response.text())
      .then((csvText) => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (result) => {
            const datosFiltrados = result.data.filter(
              (row) =>
                row.Territorio?.trim() &&
                row.Categoría?.trim() &&
                row.Información?.trim()
            );

            const agrupado = {};

            datosFiltrados.forEach((row) => {
              const territorio = row.Territorio.trim();
              const categoria = row.Categoría.trim();
              const informacion = row.Información.trim();

              if (!agrupado[territorio]) {
                agrupado[territorio] = [];
              }

              agrupado[territorio].push({
                nombre: categoria,
                informacion: informacion,
              });
            });

            const territorios = Object.entries(agrupado).map(
              ([territorio, categorias]) => ({
                territorio,
                categorias,
              })
            );
            console.log("resultadoFinal", territorios);
            resolve({ territorios });
          },
          error: (error) => {
            reject(error);
          },
        });
      })
      .catch((error) => reject(error));
  });
};

// Retorna un arreglo limpio de objetos base
export const leerMatrizCallesSegmentos = async () => {
  return new Promise((resolve, reject) => {
    Papa.parse(`${process.env.PUBLIC_URL}/data/CallesSegmentos.csv`, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        try {
          const matrizCallesSegmentos = result.data
            .filter((row) => row.Nombre && row.Coordenada)
            .map((row, i) => {
              let coords;
              console.log(`Fila ${i} coordenada cruda:`, row.Coordenada);
              try {
                const raw = row.Coordenada.trim().replace(/“|”/g, '"');
                coords = JSON.parse(raw);
              } catch (err) {
                console.error("Error al parsear coordenadas:", row.Coordenada);
                coords = [];
              }

              return {
                nombre: row.Nombre,
                direccion: row.Dirección,
                territorio: row.Territorio,
                descripcion: row["Descripción (sólo si es necesario)"],
                categoria: row.Categoría,
                coordenadas: coords,
                estado: "Pavimentación",
              };
            });

          resolve({ matrizCallesSegmentos });
        } catch (err) {
          reject(err);
        }
      },
      error: (error) => reject(error),
    });
  });
};
