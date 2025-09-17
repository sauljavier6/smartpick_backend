import { Request, Response } from "express";
import { getStatusOrder } from "../../services/smartpick/TranStatus.service";

export const getStatusData = async (req: Request, res: Response) => {
  try {
    const otsData = await getStatusOrder();

    res.json(otsData);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener datos' });
  }
};