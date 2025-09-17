// src/routes/rolRoutes.ts
import { Router } from 'express';
import { getProveedores } from '../../controllers/oc/proveedoresController';

const router = Router();

router.get("/", getProveedores);


export default router;