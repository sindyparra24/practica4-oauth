import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import passport from 'passport';

import { connectMongo } from './config/db.mongo.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import googleRoutes from './routes/google.routes.js';
import { configureGoogleStrategy } from './passport/google.strategy.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares generales
app.use(cors());
app.use(express.json());

// Inicializar Passport + estrategia de Google
app.use(passport.initialize());
configureGoogleStrategy();

// Conexión a MongoDB
connectMongo();

// Ruta básica de prueba
app.get('/', (req, res) => {
  res.json({ message: 'API práctica Unidad 4 funcionando' });
});

// Rutas de auth local (registro/login/perfil)
app.use('/api/auth', authRoutes);

// Rutas CRUD de usuarios
app.use('/api/usuarios', userRoutes);

// Rutas de OAuth con Google
// Entrada:  GET http://localhost:4000/auth/google
// Callback: GET http://localhost:4000/auth/google/callback
app.use('/auth/google', googleRoutes);

// Levantar servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});
