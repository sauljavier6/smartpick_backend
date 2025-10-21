// src/routes/rolRoutes.ts
import { Router } from 'express';
import { getData, postImage } from '../../controllers/uva/uvaController';
import { upload } from '../../middlewares/upload';
import { resizeImages } from '../../middlewares/resizeImages';

const router = Router();

router.get('/:id', getData);
router.post("/", upload.array("Imagenes", 5), resizeImages, postImage);

export default router;