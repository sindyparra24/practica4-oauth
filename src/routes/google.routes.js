import { Router } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';

const router = Router();

// Inicia el flujo de login con Google
// GET http://localhost:4000/auth/google
router.get(
  '/',
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })
);

// Callback que recibe Google
// GET http://localhost:4000/auth/google/callback
router.get(
  '/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: '/auth/google/failure'
  }),
  (req, res) => {
    const user = req.user;

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '4h' }
    );

    return res.json({
      message: 'Login con Google exitoso',
      token,
      user: {
        id: user._id,
        nombre: user.nombre,
        email: user.email,
        provider: user.provider
      }
    });
  }
);

// Si falla la autenticación
router.get('/failure', (req, res) => {
  return res.status(401).json({
    message: 'Error en la autenticación con Google'
  });
});

export default router;
