// src/routes/rolRoutes.ts
import { Router } from 'express';
import { verifyToken } from '../../middlewares/authMiddleware';
import { getUbicaciones } from '../../controllers/smartpick/UbicacionesController';

const router = Router();

router.get('/', verifyToken, getUbicaciones);

export default router;