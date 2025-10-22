import { Request, Response } from "express";
import { getSabanaData } from "../../services/sabana/sabana.service";

// GET /api/product
export const getProducts = async (_req: Request, res: Response) => {
  try {
    const items = await getSabanaData('123');
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener items' });
  }
};