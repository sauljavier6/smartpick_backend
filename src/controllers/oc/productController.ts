import { Request, Response } from 'express';
import Product from '../../models/producto';
import { getItemsFromNetSuite } from '../../services/oc/item.service';

// GET /api/product
export const getProducts = async (_req: Request, res: Response) => {
  try {
    const items = await getItemsFromNetSuite();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener items' });
  }
};

// POST /api/product
export const postProducts = async (req: Request, res: Response) => {
  try {
    const { Description, Code, Imagen, State } = req.body;

    const nuevoProducto = await Product.create({
      Description,
      Code,
      Imagen,
      State: State ?? true,
    });

    res.status(201).json(nuevoProducto);
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(400).json({ message: 'Datos inválidos o error en el servidor' });
  }
};
