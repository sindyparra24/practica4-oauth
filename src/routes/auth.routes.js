import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password) {
      return res
        .status(400)
        .json({ message: 'nombre, email y password son obligatorios' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'Ya existe un usuario con ese email' });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = await User.create({
      nombre,
      email,
      password: hash,
      provider: 'local'
    });

    return res.status(201).json({
      message: 'Usuario registrado correctamente',
      user: {
        id: user._id,
        nombre: user.nombre,
        email: user.email
      }
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error en el registro', error: error.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: 'email y password son obligatorios' });
    }

    const user = await User.findOne({ email, provider: 'local' });
    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const isMatch = await bcrypt.compare(password, user.password || '');
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '4h' }
    );

    return res.json({
      message: 'Login correcto',
      token
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error en el login', error: error.message });
  }
});

// GET /api/auth/perfil  (ruta protegida de prueba)
router.get('/perfil', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    return res.json({
      message: 'Perfil del usuario autenticado',
      user
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error al obtener perfil', error: error.message });
  }
});

export default router;
