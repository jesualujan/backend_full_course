// Importamos los módulos necesarios
import express from 'express'; // Framework para crear el servidor web
import colors from 'colors'; // Librería para colorear la salida en consola
import path, { dirname } from 'path'; // Módulo para manejar rutas de archivos
import { fileURLToPath } from 'url'; // Utilidad para convertir la URL del módulo en ruta de archivo
import authRoutes from './routes/authRoutes.js';
import todoRoutes from './routes/todoRoutes.js';
import authMiddleware from './middlewares/authMiddlewares.js';

const app = express(); // Inicializamos la aplicación de Express
const PORT = process.env.PORT || 5004;

app.use(express.json());
// Obtenemos la ruta completa del archivo actual
const __filename = fileURLToPath(import.meta.url);
// Obtenemos el directorio del archivo actual
const __dirname = dirname(__filename);

// Middleware para parsear JSON en las solicitudes
app.use(express.json());

// Servimos archivos estáticos desde la carpeta /public
// Esto permite que Express entregue archivos como CSS, JS, imágenes, etc.
app.use(express.static(path.join(__dirname, '../public')));

// Ruta principal: sirve el archivo index.html desde la carpeta /public
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

// Routes
app.use('/auth', authRoutes);
app.use('/todos', authMiddleware, todoRoutes);

// Iniciamos el servidor y mostramos mensaje en consola
app.listen(PORT, () => {
  console.log(colors.bgYellow(`🚀 Servidor iniciado en http://localhost:${PORT}`));
});
