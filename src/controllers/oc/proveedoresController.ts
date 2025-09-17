import { Request, Response } from "express";
import { getProveedoresFromNetSuite } from "../../services/oc/proveedor.service";

export const getProveedores = async (req: Request, res: Response) => {
  const proveedor = req.query.proveedor as string || "";
  
  try {
    const items = await getProveedoresFromNetSuite(proveedor);
    res.json(items);
  } catch (error) {
    console.error("Error en getProveedores:", error);
    res.status(500).json({ message: 'Error al obtener items' });
  }
};
