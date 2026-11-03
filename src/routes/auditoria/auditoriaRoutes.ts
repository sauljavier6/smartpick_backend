import { Router } from 'express';
import { getArticulos } from '../../controllers/auditoria/auditoriaController';
import { verifyToken } from '../../middlewares/authMiddleware';
const router = Router();
router.get('/articulos', verifyToken, getArticulos);
export default router;
