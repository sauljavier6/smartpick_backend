// src/routes/rolRoutes.ts
import { Router } from 'express';
import { getStatusData } from '../../controllers/smartpick/tranStatusController';

const router = Router();

router.get('/', getStatusData);

export default router;