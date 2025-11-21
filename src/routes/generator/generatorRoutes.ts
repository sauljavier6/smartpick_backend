// src/routes/rolRoutes.ts
import { Router } from 'express';
import { deleteProductsForPrint, getOfertas, getOfertasByUpc, getProductsToPrint, postProductForPrint, printCenefa, printCenefaByData } from '../../controllers/generator/generatorController';

const router = Router();

router.get('/', getOfertas);
router.get('/upc', getOfertasByUpc);
router.get('/print/products', getProductsToPrint);
router.get("/printcenefa/:ID_User", printCenefa);
router.get("/printcenefa/by/data", printCenefaByData);
router.post('/print', postProductForPrint);
router.delete("/productforprint", deleteProductsForPrint);

export default router;