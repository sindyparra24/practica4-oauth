import { Router } from 'express';
import { User } from '../models/User.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

// CREATE - POST /api/usuarios
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    if (!nombre || !email) {
      return res
        .status(400)
        .json({ message: 'nombre y email son obligatorios' });
    }

    const user = await User.create({
      nombre,
      email,
      password,
      provider: 'local'
    });

    res.status(201).json({ message: 'Usuario creado', user });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear usuario', error: error.message });
  }
});

// READ ALL - GET /api/usuarios
router.get('/', authMiddleware, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error al listar usuarios', error: error.message });
  }
});

// READ ONE - GET /api/usuarios/:id
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener usuario', error: error.message });
  }
});

// UPDATE - PUT /api/usuarios/:id
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { nombre, email } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { nombre, email },
      { new: true }
    ).select('-password');

    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json({ message: 'Usuario actualizado', user });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar usuario', error: error.message });
  }
});

// DELETE - DELETE /api/usuarios/:id
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Usuario no encontrado' });

    res.json({ message: 'Usuario eliminado' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar usuario', error: error.message });
  }
});

export default router;
