// src/routes/rolRoutes.ts
import { Router } from 'express';
import { getOfertas, toPrint } from '../../controllers/generator/generatorController';

const router = Router();

router.post('/', toPrint);
router.get('/', getOfertas);

export default router;