import { Request, Response } from 'express';
import { listarArticulos } from '../../services/auditoria/articulosService';
import ExcelJS from 'exceljs';

export async function getArticulos(req: Request, res: Response) {
  const buscar = String(req.query.buscar ?? '').trim().slice(0, 80);
  const sucursal = String(req.query.sucursal ?? 'TODAS').trim().toUpperCase();
  const pagina = Math.max(1, Number.parseInt(String(req.query.pagina ?? '1'), 10) || 1);
  const limite = Math.min(100, Math.max(1, Number.parseInt(String(req.query.limite ?? '25'), 10) || 25));
  if (!/^[A-Z0-9 ]{1,20}$/.test(sucursal)) {
    res.status(400).json({ message: 'Sucursal inválida' });
    return;
  }
  try {
    res.json(await listarArticulos({ buscar, sucursal, pagina, limite }));
  } catch (error) {
    console.error('Auditoria:', error);
    res.status(500).json({ message: 'No fue posible consultar los artículos' });
  }
}

export async function exportarArticulos(req: Request, res: Response) {
  const buscar = String(req.query.buscar ?? '').trim().slice(0, 80);
  const sucursal = String(req.query.sucursal ?? 'TODAS').trim().toUpperCase();
  if (!/^[A-Z0-9 ]{1,20}$/.test(sucursal)) {
    res.status(400).json({ message: 'Sucursal inválida' });
    return;
  }
  try {
    const primera = await listarArticulos({ buscar, sucursal, pagina: 1, limite: 1000 });
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="auditoria_articulos.xlsx"');
    const workbook = new ExcelJS.stream.xlsx.WorkbookWriter({ stream: res, useStyles: true });
    const sheet = workbook.addWorksheet('Artículos');
    sheet.columns = [
      { header: 'Artículo', key: 'item_code', width: 20 },
      { header: 'UPC', key: 'upc', width: 22 },
      { header: 'Descripción', key: 'DESCRIPCION', width: 45 },
      { header: 'Proveedor', key: 'nombreProveedor', width: 30 },
      { header: 'Tecla', key: 'tecla', width: 15 },
      { header: 'Precio normal', key: 'Precio_Venta', width: 18 },
      { header: 'Precio especial', key: 'PRECIO_ESPECIAL', width: 18 },
      { header: 'Precio final', key: 'PRECIO_FINAL', width: 18 },
      { header: 'Tipo promoción', key: 'TIPO_PROMO', width: 20 },
      { header: 'Promoción', key: 'PROMOCION', width: 30 },
      { header: 'Fecha inicio', key: 'Fecha_Ini', width: 18 },
      { header: 'Fecha fin', key: 'Fecha_Fin', width: 18 },
      { header: 'Tiene promoción', key: 'TIENE_PROMOCION', width: 18 },
    ];
    sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    sheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFB91C1C' } };
    sheet.getRow(1).commit();
    const escribir = (rows: any[]) => {
      for (const item of rows) {
        const row = sheet.addRow({
          ...item,
          item_code: String(item.item_code ?? ''),
          upc: String(item.upc ?? ''),
          tecla: String(item.tecla ?? ''),
          TIENE_PROMOCION: item.TIENE_PROMOCION ? 'Sí' : 'No',
        });
        for (const key of ['Precio_Venta', 'PRECIO_ESPECIAL', 'PRECIO_FINAL']) {
          const cell = row.getCell(key);
          if (cell.value !== null && cell.value !== undefined) {
            cell.value = Number(cell.value);
            cell.numFmt = '"$"#,##0.00';
          }
        }
        row.commit();
      }
    };
    escribir(primera.data);
    const paginas = Math.ceil(primera.total / 1000);
    for (let pagina = 2; pagina <= paginas; pagina++) {
      const siguiente = await listarArticulos({ buscar, sucursal, pagina, limite: 1000 });
      escribir(siguiente.data);
    }
    sheet.commit();
    await workbook.commit();
  } catch (error) {
    console.error('Exportación Auditoría:', error);
    if (!res.headersSent) res.status(500).json({ message: 'No fue posible exportar artículos' });
    else res.destroy(error instanceof Error ? error : new Error('Error de exportación'));
  }
}

export async function getArticuloExacto(req: Request, res: Response) {
  const buscar = String(req.query.codigo ?? '').trim().slice(0, 80);
  const sucursal = String(req.query.sucursal ?? 'TODAS').trim().toUpperCase();
  if (!buscar || !/^[A-Z0-9 ]{1,20}$/.test(sucursal)) {
    res.status(400).json({ message: 'Código o sucursal inválidos' });
    return;
  }
  try {
    const resultado = await listarArticulos({ buscar, sucursal, pagina: 1, limite: 10, exacto: true });
    res.json({ articulo: resultado.data[0] ?? null });
  } catch (error) {
    console.error('Checador de precios:', error);
    res.status(500).json({ message: 'No fue posible consultar el precio' });
  }
}

