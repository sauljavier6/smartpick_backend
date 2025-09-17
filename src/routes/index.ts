import { Router } from 'express';
import productRoutes from './oc/productRoutes';
import proveedorRoutes from './oc/proveedorRoutes';
import ordenCompraRoutes from './oc/ordenCompraRoutes';
import authRoutes from './auth/authRoutes';

import orderTraslateRoutes from './smartpick/orderTraslateRoutes';
import tranStatusRoutes from './smartpick/tranStatusRoutes';
import generatorRoutes from './generator/generatorRoutes';

const router = Router();

router.use('/login', authRoutes);

// Prefijos para cada grupo de rutas
router.use('/products', productRoutes);
router.use('/searshProveedores', proveedorRoutes);
router.use('/ordencompra', ordenCompraRoutes);


// Rutas smartpick
router.use('/smartpick', orderTraslateRoutes);
router.use('/transtatus', tranStatusRoutes);

// Rutas generator
router.use('/generator', generatorRoutes);

export default router;