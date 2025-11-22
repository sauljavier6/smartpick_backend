// src/routes/rolRoutes.ts
import { Router } from 'express';
import { deleteProductsForPrint, getOfertas, getOfertasByUpc, getProductsToPrint, postProductForPrint, printCenefa, printCenefaByData, printPrecioByData, printPrecios } from '../../controllers/generator/generatorController';

const router = Router();

router.get('/', getOfertas);
router.get('/upc', getOfertasByUpc);
router.get('/print/products', getProductsToPrint);
router.get("/printcenefa/:ID_User", printCenefa);
router.get("/printprecios/precio/:ID_User", printPrecios);
router.post('/print', postProductForPrint);
router.post("/printcenefa/bydata", printCenefaByData);
router.post("/printprecio/precio/bydata", printPrecioByData);
router.delete("/productforprint", deleteProductsForPrint);

export default router;