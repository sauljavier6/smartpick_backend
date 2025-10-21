// src/routes/rolRoutes.ts
import { Router } from 'express';
import { completedOrder, exportOrderExcel, getData, getDatawithItems, getmyorders, getorderbyid, printOrder, updateOrderDep } from '../../controllers/smartpick/orderTraslateController';
import { verifyToken } from '../../middlewares/authMiddleware';

const router = Router();

router.get('/:id', verifyToken, getData);
router.get('/pick/:id/:idpicker', verifyToken, getDatawithItems);
router.get('/detallespick/:idpicker', verifyToken, getmyorders);
router.get("/buscar/:id", verifyToken, getorderbyid);
router.get("/pdf/:tranid", verifyToken, printOrder);
router.get("/excel/:tranid", exportOrderExcel);
router.put("/:id/:idpicker/:tranid", verifyToken, updateOrderDep);
router.put("/completeddep/:id/:idpicker/:tranid", verifyToken, completedOrder);

export default router;