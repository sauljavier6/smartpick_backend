// src/routes/rolRoutes.ts
import { Router } from 'express';
import { login, logout } from '../../controllers/auth/AuthLoginController';
import { verifyToken } from '../../middlewares/authMiddleware';

const router = Router();

router.post('/', login);
router.get('/', verifyToken, (req: any, res) => {
  res.json(req.user);
});
router.post('/logout', logout);

export default router;