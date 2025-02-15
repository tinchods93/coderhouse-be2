import express from 'express';
import mongoose from 'mongoose';
import userRouter from './routes/userRouter.js';
import adminRouter from './routes/adminRouter.js';
import sessionsRouter from './routes/sessionsRouter.js';
import passport from 'passport';
import InitPassport from './services/passport.js';
import UserDomain from './domain/userDomain.js';

const app = express();

// Iniciamos la conexión con MongoDB
const uri = 'mongodb://127.0.0.1:27017/coderhouse-b2-mds';

// Conexión a la base de datos
mongoose.connect(uri);

// Middlewares incorporados de Express
app.use(express.json()); // Formatea los cuerpos json de peticiones entrantes.
app.use(express.urlencoded({ extended: true })); // Formatea query params de URLs para peticiones entrantes.
app.use(express.static('public')); // Sirve archivos estáticos desde la carpeta public.
InitPassport(); // Configura Passport para autenticación con JWT.
app.use(passport.initialize()); // Inicializa el middleware de Passport.

app.use('/api/users', userRouter);
app.use('/api/admin', adminRouter);
app.use('/api/sessions', sessionsRouter);

const PORT = 8080;
app.listen(PORT, async () => {
  console.log(`Start Server in Port ${PORT}`);
  // create an admin user if not exists
  const tempAdminData = {
    email: 'coderbe2.admin.mds@gmail.com',
    password: 'Admin123$',
    role: 'admin',
  };
  await UserDomain.createUser(tempAdminData).catch((error) => {});
  console.log('Admin Data:', tempAdminData);
});
