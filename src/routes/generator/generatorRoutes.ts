// src/routes/rolRoutes.ts
import { Router } from 'express';
import { toPrint } from '../../controllers/generator/generatorController';

const router = Router();

router.post('/', toPrint);

export default router;