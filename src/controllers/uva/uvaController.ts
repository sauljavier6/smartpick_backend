import Product from "../../models/uva/producto";
import { getProduct } from "../../services/uva/ProductService";

export const getData = async (req: any, res: any) => {
  try {
    const upccode = req.params.id;
    let data;
    data = await Product.findOne({ where: { SKU: upccode } });

    if (!data) {
      const prod = await getProduct(upccode) as any;
      const producto = prod[0];

      data = await Product.create({
        Description: producto?.description,
        SKU: producto?.upccode,
        Marca: producto?.custitem_nso_marca_articulo,
        Pais: producto?.custitem_nso_origen_articulo,
        ID_Categoria: producto?.custitem_nso_categoria_articulo,
        Imagen: "",
      });
    }

    res.status(200).json({
      data,
      message: "Producto obtenidas correctamente",
    });
  } catch (error) {
    console.error("Error al obtener Producto:", error);
    res.status(500).json({ message: "Error en el servidor", error });
  }
};


export const postImage = async (req: any, res: any) => {
  try {
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      return res.status(400).json({ message: "No se subieron imágenes" });
    }

    // Construye URLs o rutas para devolver al frontend
    const uploadedImages = files.map((file) => ({
      name: file.filename,
      path: `/uploads/${file.filename}`, // para servir estáticamente desde Express
      size: file.size,
    }));

    res.status(200).json({
      message: "Imágenes subidas correctamente",
      images: uploadedImages,
    });
  } catch (error) {
    console.error("Error al subir imágenes:", error);
    res.status(500).json({ message: "Error en el servidor", error });
  }
};