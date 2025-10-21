import { Router } from 'express';
import productRoutes from './oc/productRoutes';
import proveedorRoutes from './oc/proveedorRoutes';
import ordenCompraRoutes from './oc/ordenCompraRoutes';
import authRoutes from './auth/authRoutes';

import orderTraslateRoutes from './smartpick/orderTraslateRoutes';
import tranStatusRoutes from './smartpick/tranStatusRoutes';
import generatorRoutes from './generator/generatorRoutes';
import ubicacionesRoutes from './smartpick/ubicacionesRoutes';
import uvaRoutes from './uva/uvaRoutes';

const router = Router();

router.use('/login', authRoutes);

// Prefijos para cada grupo de rutas
router.use('/products', productRoutes);
router.use('/searshProveedores', proveedorRoutes);
router.use('/ordencompra', ordenCompraRoutes);


// Rutas smartpick
router.use('/smartpick', orderTraslateRoutes);
router.use('/transtatus', tranStatusRoutes);
router.use('/ubicaciones', ubicacionesRoutes);

// Rutas generator
router.use('/generator', generatorRoutes);

// Rutas UVA
router.use('/uva', uvaRoutes);

export default router;