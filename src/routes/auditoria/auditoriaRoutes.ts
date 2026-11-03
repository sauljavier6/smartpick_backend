import { Router } from 'express';
import { getArticulos, exportarArticulos, getArticuloExacto } from '../../controllers/auditoria/auditoriaController';
import { verifyToken } from '../../middlewares/authMiddleware';
const router = Router();
router.get('/articulos', verifyToken, getArticulos);
router.get('/articulos/consultar', verifyToken, getArticuloExacto);
router.get('/articulos/excel', verifyToken, exportarArticulos);
export default router;
