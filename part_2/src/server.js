import express from 'express';
import colors from 'colors';
import path, { dirname } from 'path'; // Modulo para manejar rutas con archivos
import { fileURLToPath } from 'url'; // Utilidad para convertir la URL del modulo en ruta de archivo
// importar las rutas
import authRoutes from './routes/authRoutes.js';
import todoRoutes from './routes/todoRoutes.js';
import authMiddleware from './middlewares/authMiddlewares.js';

const app = express(); // nicializamos la app con express
const PORT = process.env.PORT || 3001; // definimos el puerto, usando una .env

// obtenemos la ruta completa del archivo actual
const __filename = fileURLToPath(import.meta.url);
// obtenemos la ruta del archivo actual
const __dirname = dirname(__filename);

// servimos archivos estaticos desde la carpeta /public
// esto permite que express entregue archivos como css, js, imagenes, etc.
app.use(express.static(path.join(__dirname, '../public')));

// Middlewares
app.use(express.json()); // parsear JSON en las solicitudes

// RUTA PRINCIPAL: sirve el archivo index.html desde la carpeta /public
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Routes
app.use('/auth', authRoutes);
app.use('/todos', authMiddleware, todoRoutes);

// Iniciamos el servidor y mostramos un mensaje en consola
app.listen(PORT, () => {
  console.log(
    colors.bgMagenta(`
    🚀 Servidor escuchando en http://localhost:${PORT}`)
  );
});
