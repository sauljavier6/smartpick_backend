// src/routes/rolRoutes.ts
import { Router } from 'express';
import { getData } from '../../controllers/oc/ordenCompraController';

const router = Router();

router.get('/', getData);

export default router;