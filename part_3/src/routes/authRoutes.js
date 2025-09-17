// 📦 Importamos las dependencias necesarias
import express from 'express'; // Framework para crear rutas y manejar peticiones HTTP
import bcrypt from 'bcryptjs'; // Librería para encriptar contraseñas de forma segura
import jwt from 'jsonwebtoken'; // Librería para generar tokens JWT (autenticación)
import prisma from '../prismaClient.js'; // Cliente de Prisma para interactuar con la base de datos

import dontenv from 'dotenv'; // Librería para manejar variables de entorno
dontenv.config(); // Carga las variables definidas en el archivo .env al objeto process.env

// 🚪 Creamos un router de Express para agrupar rutas relacionadas con autenticación
const router = express.Router();

// 🧑‍💻 Ruta para registrar un nuevo usuario: POST /auth/register
router.post('/register', async (req, res) => {
  // Extraemos el nombre de usuario y la contraseña del cuerpo de la petición
  const { username, password } = req.body;

  // Encriptamos la contraseña con bcrypt usando 10 rondas de sal
  // Más rondas = más seguridad, pero también más tiempo de cómputo
  const hashedPassword = bcrypt.hashSync(password, 10);

  try {
    // Creamos el usuario en la base de datos con la contraseña encriptada
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
      },
    });

    // 📝 Creamos una tarea por defecto para el nuevo usuario
    const defaultTodo = `Hello :) Add your first todo!`;
    await prisma.todo.create({
      data: {
        task: defaultTodo,
        userId: user.id, // Asociamos la tarea al ID del usuario recién creado
      },
    });

    // 🔐 Generamos un token JWT que expira en 24 horas
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });

    // Enviamos el token como respuesta al cliente
    res.json({ token });
  } catch (err) {
    // Si ocurre un error, lo mostramos en consola y respondemos con error 503
    console.log(err.message);
    res.sendStatus(503);
  }
});

// 🔐 Ruta para iniciar sesión: POST /auth/login
router.post('/login', async (req, res) => {
  // Extraemos el nombre de usuario y la contraseña del cuerpo de la petición
  const { username, password } = req.body;

  try {
    // Buscamos al usuario en la base de datos por su nombre de usuario
    const user = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });

    // Si no se encuentra el usuario, devolvemos error 404
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    // Comparamos la contraseña ingresada con la almacenada (encriptada)
    const passwordIsValid = bcrypt.compareSync(password, user.password);

    // Si la contraseña no coincide, devolvemos error 401 (no autorizado)
    if (!passwordIsValid) {
      return res.status(401).send({ message: 'Invalid password' });
    }

    // Si la autenticación es exitosa, mostramos el usuario en consola (opcional)
    console.log(user);

    // Generamos un token JWT válido por 24 horas
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });

    // Enviamos el token como respuesta al cliente
    res.json({ token });
  } catch (err) {
    // Si ocurre un error, lo mostramos en consola y respondemos con error 503
    console.log(err.message);
    res.sendStatus(503);
  }
});

// 🚀 Exportamos el router para usarlo en el servidor principal
export default router;
