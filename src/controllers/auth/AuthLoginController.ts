import { getUser } from '../../services/auth/AuthLogin';
import jwt from 'jsonwebtoken';

export const login = async (req: any, res: any) => {
  const { email, iduser } = req.body;

  try {
    if (!email || !iduser) {
      return res.status(400).json({ message: 'Faltan datos de acceso' });
    }

    const user = await getUser(iduser, email);

    if (!user) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    const token = jwt.sign(
      {
        ID_User: user.custentity_nso_numero_empleado_nomina,
        Name: user.entityid,
        ID_Rol: user.title,
        Email: user.email
      },
      process.env.JWT_SECRET!,
      { expiresIn: '1d' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000
    });

    return res.json({ message: 'Inicio de sesión exitoso' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al iniciar sesión' });
  }
};

export const logout = (req: any, res: any) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });

  return res.json({ message: 'Sesión cerrada exitosamente' });
};