import { Request, Response } from 'express';
import { listarArticulos } from '../../services/auditoria/articulosService';

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
