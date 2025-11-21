import { getIdByUpc, getOfertasdata } from "../../services/generator/generator";
import ProductToPrint from "../../models/generator/ProductToPrint";
import PDFDocument from "pdfkit";
import bwipjs from "bwip-js";

const formatDate = (date: Date | string) => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

export const printCenefa = async (req: any, res: any) => {
  const { ID_User } = req.params;

  try {
    const productos = await ProductToPrint.findAll({ where: { ID_User } });

    // MEDIDAS CONVERTIDAS A PIXELES
    const marginLeft = 71; // 2.5 cm
    const marginRight = 71; // 2.5 cm
    const marginTop = 45; // 1.6 cm
    const marginBottom = 45; // 1.6 cm

    const cenefaWidth = 215; // 7.6 cm
    const cenefaHeight = 261; // 9.2 cm

    const doc = new PDFDocument({
      size: "LETTER",
      layout: "landscape",
      margins: {
        top: marginTop,
        left: marginLeft,
        right: marginRight,
        bottom: marginBottom,
      },
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline; filename=cenefa.pdf");

    doc.pipe(res);

    const usableWidth = doc.page.width - marginLeft - marginRight;
    const usableHeight = doc.page.height - marginTop - marginBottom;

    const cols = Math.floor(usableWidth / cenefaWidth);
    const rows = Math.floor(usableHeight / cenefaHeight);

    const cenefasPorPagina = cols * rows;

    let index = 0;

    for (let p of productos) {
      const col = index % cols;
      const row = Math.floor(index / cols) % rows;

      const x = marginLeft + col * cenefaWidth;
      const y = marginTop + row * cenefaHeight;

      // ---- CONTENIDO DE CENEFA ----

      doc.fontSize(10).text(p.NombreProveedor, x, y);

      doc
        .fontSize(12)
        .font("Helvetica-Bold")
        .text(p.Description, x, y + 15, { width: cenefaWidth - 20 });

      doc.rect(x, y + 50, 120, 40).fill("#F4D03F");
      doc
        .fillColor("black")
        .fontSize(26)
        .text(`$${p.Precio_Venta}`, x + 5, y + 55);

      const barcodePng = await bwipjs.toBuffer({
        bcid: "code128",
        text: p.Upc,
        scale: 1,
        height: 6,
        includetext: false,
      });

      const barcodeWidth = 70;
      const barcodeHeight = 28;

      doc.image(barcodePng, x + cenefaWidth - barcodeWidth - 20, y + 50, {
        width: barcodeWidth,
        height: barcodeHeight,
      });

      doc
        .fontSize(9)
        .text(
          p.Upc,
          x + cenefaWidth - barcodeWidth - 20,
          y + 50 + barcodeHeight + 3
        );

      doc.rect(x, y + 110, cenefaWidth - 20, 35).fill("#B03A2E");

      doc
        .fillColor("white")
        .fontSize(26)
        .text("Especial", x + (cenefaWidth - 20) / 2 - 40, y + 113);

      doc
        .fillColor("black")
        .fontSize(26)
        .text(`$${p.Precio_especial || "-"}`, x + 65, y + 150);

      doc
        .fontSize(10)
        .text(
          `Vigencia: ${formatDate(p.Fecha_Ini)} al ${formatDate(p.Fecha_Fin)}`,
          x + 5,
          y + 190
        );

      index++;

      if (index % cenefasPorPagina === 0 && index < productos.length) {
        doc.addPage();
      }
    }

    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error generando PDF" });
  }
};

export const printCenefaByData = async (req: any, res: any) => {
  const productos = req.body.productos;

  console.log(productos); // aquí ya llegan

  try {
    //const productos = await ProductToPrint.findAll({ where: { ID_User } });

    // MEDIDAS CONVERTIDAS A PIXELES
    const marginLeft = 71; // 2.5 cm
    const marginRight = 71; // 2.5 cm
    const marginTop = 45; // 1.6 cm
    const marginBottom = 45; // 1.6 cm

    const cenefaWidth = 215; // 7.6 cm
    const cenefaHeight = 261; // 9.2 cm

    const doc = new PDFDocument({
      size: "LETTER",
      layout: "landscape",
      margins: {
        top: marginTop,
        left: marginLeft,
        right: marginRight,
        bottom: marginBottom,
      },
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline; filename=cenefa.pdf");

    doc.pipe(res);

    const usableWidth = doc.page.width - marginLeft - marginRight;
    const usableHeight = doc.page.height - marginTop - marginBottom;

    const cols = Math.floor(usableWidth / cenefaWidth);
    const rows = Math.floor(usableHeight / cenefaHeight);

    const cenefasPorPagina = cols * rows;

    let index = 0;

    for (let p of productos) {
      const col = index % cols;
      const row = Math.floor(index / cols) % rows;

      const x = marginLeft + col * cenefaWidth;
      const y = marginTop + row * cenefaHeight;

      // ---- CONTENIDO DE CENEFA ----

      doc.fontSize(10).text(p.NombreProveedor, x, y);

      doc
        .fontSize(12)
        .font("Helvetica-Bold")
        .text(p.Description, x, y + 15, { width: cenefaWidth - 20 });

      doc.rect(x, y + 50, 120, 40).fill("#F4D03F");
      doc
        .fillColor("black")
        .fontSize(26)
        .text(`$${p.Precio_Venta}`, x + 5, y + 55);

      const barcodePng = await bwipjs.toBuffer({
        bcid: "code128",
        text: p.Upc,
        scale: 1,
        height: 6,
        includetext: false,
      });

      const barcodeWidth = 70;
      const barcodeHeight = 28;

      doc.image(barcodePng, x + cenefaWidth - barcodeWidth - 20, y + 50, {
        width: barcodeWidth,
        height: barcodeHeight,
      });

      doc
        .fontSize(9)
        .text(
          p.Upc,
          x + cenefaWidth - barcodeWidth - 20,
          y + 50 + barcodeHeight + 3
        );

      doc.rect(x, y + 110, cenefaWidth - 20, 35).fill("#B03A2E");

      doc
        .fillColor("white")
        .fontSize(26)
        .text("Especial", x + (cenefaWidth - 20) / 2 - 40, y + 113);

      doc
        .fillColor("black")
        .fontSize(26)
        .text(`$${p.Precio_especial || "-"}`, x + 65, y + 150);

      doc
        .fontSize(10)
        .text(
          `Vigencia: ${formatDate(p.Fecha_Ini)} al ${formatDate(p.Fecha_Fin)}`,
          x + 5,
          y + 190
        );

      index++;

      if (index % cenefasPorPagina === 0 && index < productos.length) {
        doc.addPage();
      }
    }

    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error generando PDF" });
  }
};

export const getOfertas = async (req: any, res: any) => {
  const sucursal = req.query.sucursal;
  try {
    const data = await getOfertasdata(sucursal);

    res.json({ message: "success", data });
  } catch (err) {
    res.status(500).json({ ok: false, error: err });
  }
};

export const getOfertasByUpc = async (req: any, res: any) => {
  const upc = req.query.upc;
  try {
    const data = await getIdByUpc(upc);

    res.json({ message: "success", data });
  } catch (err) {
    res.status(500).json({ ok: false, error: err });
  }
};

export const postProductForPrint = async (req: any, res: any) => {
  let {
    ID_User,
    item_code,
    DESCRIPCION,
    Fecha_Fin,
    Fecha_Ini,
    PRECIO_ESPECIAL,
    Precio_Venta,
    TIPO_PROMO,
    tecla,
    upc,
    nombreProveedor,
  } = req.body;

  const parseDateInput = (dateValue: any, fieldName: string): string | null => {
    if (typeof dateValue !== "string" || !dateValue.trim()) {
      return null;
    }

    if (dateValue.toLowerCase() === "invalid date") {
      return null;
    }

    const parts = dateValue.split("-");
    if (parts.length === 3 && parts[2].length === 4) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const year = parseInt(parts[2], 10);

      const date = new Date(year, month, day, 12);

      if (date instanceof Date && !isNaN(date.getTime())) {
        return date.toISOString();
      }
    }

    const standardDate = new Date(dateValue);
    if (standardDate instanceof Date && !isNaN(standardDate.getTime())) {
      return standardDate.toISOString();
    }

    return null;
  };

  const parsedFechaFin = parseDateInput(Fecha_Fin, "Fecha_Fin");
  const parsedFechaIni = parseDateInput(Fecha_Ini, "Fecha_Ini");

  if (!parsedFechaFin) {
    return res.status(400).json({
      ok: false,
      error: "Datos de entrada inválidos",
      message:
        "El campo 'Fecha_Fin' es requerido y la fecha proporcionada no es válida o está en un formato incorrecto (esperado: DD-MM-YYYY o ISO 8601).",
    });
  }

  if (!parsedFechaIni) {
    return res.status(400).json({
      ok: false,
      error: "Datos de entrada inválidos",
      message:
        "El campo 'Fecha_Ini' es requerido y la fecha proporcionada no es válida o está en un formato incorrecto (esperado: DD-MM-YYYY o ISO 8601).",
    });
  }

  const parsedPrecioEspecial = parseFloat(PRECIO_ESPECIAL);
  const parsedPrecioVenta = parseFloat(Precio_Venta);

  if (isNaN(parsedPrecioEspecial) || isNaN(parsedPrecioVenta)) {
    return res.status(400).json({
      ok: false,
      error: "Datos de entrada inválidos",
      message:
        "Los campos de precio ('PRECIO_ESPECIAL' y 'Precio_Venta') deben ser valores numéricos válidos.",
    });
  }

  try {
    const nuevo = await ProductToPrint.create({
      ID_User,
      item_code: item_code,
      Description: DESCRIPCION,
      Fecha_Fin: parsedFechaFin,
      Fecha_Ini: parsedFechaIni,
      Precio_especial: parsedPrecioEspecial,
      Precio_Venta: parsedPrecioVenta,
      Tipo_promo: TIPO_PROMO,
      Tecla: tecla,
      Upc: upc,
      NombreProveedor: nombreProveedor,
      State: true,
    });

    res.status(201).json({
      ok: true,
      data: nuevo,
      message: "Producto guardado exitosamente para impresión.",
    });
  } catch (err) {
    console.error("Error al crear el producto en DB:", err);

    res.status(500).json({
      ok: false,
      error: "Error interno del servidor al procesar la solicitud.",
      details:
        (err as any).name === "SequelizeDatabaseError"
          ? "Revisa el formato de los datos, especialmente si otros campos numéricos o de texto tienen problemas."
          : undefined,
    });
  }
};

export const getProductsToPrint = async (req: any, res: any) => {
  const ID_User = req.query.ID_User;
  try {
    const data = await ProductToPrint.findAll({ where: { ID_User: ID_User } });

    res.json(data);
  } catch (err) {
    res.status(500).json({ ok: false, error: err });
  }
};

export const deleteProductsForPrint = async (req: any, res: any) => {
  const { ID_User } = req.query;

  try {
    await ProductToPrint.destroy({
      where: { ID_User },
    });

    res.json({ ok: true, message: "Productos eliminados después de imprimir" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: err });
  }
};
