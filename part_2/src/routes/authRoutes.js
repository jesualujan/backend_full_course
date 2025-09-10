// Importamos las dependencias necesarias
import express from 'express'; // Framework para crear rutas y manejar peticiones HTTP
import bcrypt from 'bcrypt'; // Librería para encriptar contraseñas de forma segura
import jwt from 'jsonwebtoken'; // Librería para generar tokens JWT (autenticación)
import db from '../db.js'; // Importamos la instancia de la base de datos SQLite
import dontenv from 'dotenv'; // Librería para manejar variables de entorno
dontenv.config();

// Creamos un router de Express para agrupar rutas relacionadas con autenticación
const router = express.Router();

// 📌 Ruta para registrar un nuevo usuario: POST /auth/register
router.post('/register', (req, res) => {
  const { username, password } = req.body; // Extraemos datos del cuerpo de la petición
  // Encriptamos la contraseña con un hash irreversible (salt de 10 rondas)
  //Más rondas = más seguridad, pero también más tiempo de cómputo. Aquí una referencia rápida:
  const hashedPassword = bcrypt.hashSync(password, 10);
  try {
    // Insertamos el nuevo usuario en la tabla 'users' con la contraseña encriptada
    const insertUser = db.prepare(`INSERT INTO users (username, password) VALUES (?, ?)`);
    const result = insertUser.run(username, hashedPassword);

    // Creamos una tarea por defecto para el nuevo usuario
    const defaultTodo = `Hello :) Add your first todo!`;
    const insertTodo = db.prepare(`INSERT INTO todos (id_user, task) VALUES (?, ?)`);
    insertTodo.run(result.lastInsertRowid, defaultTodo); // Usamos el ID del usuario recién creado

    // Registro de login validacion de jwt
    if (!process.env.JWT_SECRET) {
      throw new Error('❌ JWT_SECRET no está definido. Verifica tu archivo .env');
    }
    // Generamos un token JWT que expira en 24 horas
    const token = jwt.sign(
      { id: result.lastInsertRowid }, // Payload con el ID del usuario
      process.env.JWT_SECRET, // Clave secreta para firmar el token
      { expiresIn: '24h' } // Tiempo de expiración
    );

    // Respondemos con el token generado
    res.json({ token });
  } catch (err) {
    // Si ocurre un error (por ejemplo, usuario duplicado), lo mostramos y respondemos con 503
    console.log(err.message);
    res.sendStatus(503);
  }
});

// 📌 Ruta para iniciar sesión: POST /auth/login
router.post('/login', (req, res) => {
  const { username, password } = req.body; // Extraemos credenciales del cuerpo de la petición

  try {
    // Buscamos al usuario por nombre en la base de datos
    const getUser = db.prepare('SELECT * FROM users WHERE username = ?');
    const user = getUser.get(username);

    // Si no se encuentra el usuario, respondemos con 404
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    // Comparamos la contraseña ingresada con la almacenada (encriptada)
    const passwordIsValid = bcrypt.compareSync(password, user.password);

    // Si la contraseña no coincide, respondemos con 401 (no autorizado)
    if (!passwordIsValid) {
      return res.status(401).send({ message: 'Invalid password' });
    }

    // Si la autenticación es exitosa, generamos un token JWT
    const token = jwt.sign(
      { id: user.id }, // Payload con el ID del usuario
      process.env.JWT_SECRET, // Clave secreta
      { expiresIn: '24h' } // Expiración del token
    );

    // Respondemos con el token
    res.json({ token });
  } catch (err) {
    // Si ocurre un error inesperado, lo mostramos y respondemos con 503
    console.log(err.message);
    res.sendStatus(503);
  }
});

// Exportamos el router para usarlo en el servidor principal
export default router;
