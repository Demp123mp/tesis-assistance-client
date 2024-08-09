import XlsxPopulate from "xlsx-populate";

const abc = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export async function CreateExcel(cols, data) {
  const workbook = await XlsxPopulate.fromBlankAsync();
  const sheet = workbook.sheet("Sheet1");

  // Escribir encabezados de columna
  cols.forEach((col, index) => {
    const cell = sheet.cell(`${abc.charAt(index)}1`);
    cell.value(col.header);
  });

  // Escribir valores de fila
  data.forEach((row, rowIndex) => {
    cols.forEach((col, colIndex) => {
      const cell = sheet.cell(`${abc.charAt(colIndex)}${rowIndex + 2}`);
      cell.value(row[col.key]);
    });
  });

  // Guardar el archivo
  const buffer = await workbook.outputAsync();
  workbook.toFileAsync("./assets/prueba.xlsx");

  // Crear un objeto Blob
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  return blob;
}

export async function ReadExcel(filePath, owner, cols) {
  const workbook = await XlsxPopulate.fromFileAsync(filePath);
  const table = workbook.sheet("Sheet1")
    ? workbook.sheet("Sheet1").usedRange().value()
    : workbook.sheet("Hoja1").usedRange().value();
  const columns = JSON.parse(cols);
  const fileCols = table[0].map((header, index) => ({
    key: header.toLowerCase().replace(/\s+/g, ""), //* Convertir a minúsculas y eliminar espacios
    header: header,
  }));

  //*  Extraer los datos y asignarlos a 'data'
  const data = table.slice(1).map((row) => {
    const rowData = {};
    fileCols.forEach((col, index) => {
      rowData[columns.find((column) => col.key === column.header).key] = String(
        row[index],
      ).trim();
    });
    // Agregar la propiedad 'owner' con el valor pasado como parámetro
    rowData.owner = owner;

    return rowData;
  });
  return data;
}
