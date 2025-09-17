// src/routes/rolRoutes.ts
import { Router } from 'express';
import { getProducts, postProducts } from '../../controllers/oc/productController';
import { verifyToken } from '../../middlewares/authMiddleware';

const router = Router();

router.get('/', verifyToken, getProducts);
router.post('/', postProducts);


export default router;