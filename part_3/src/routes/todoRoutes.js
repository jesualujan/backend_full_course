// 📦 Importamos las dependencias necesarias
import express from 'express'; // Framework para crear rutas y manejar peticiones HTTP
import prisma from '../prismaClient.js'; // Cliente de Prisma para interactuar con la base de datos

// 🚪 Creamos un router modular para agrupar rutas relacionadas con tareas ("todos")
const router = express.Router();

// ==============================
// 📋 Obtener todas las tareas del usuario autenticado
// ==============================
router.get('/', async (req, res) => {
  // Busca todas las tareas en la base de datos que pertenezcan al usuario autenticado
  const todos = await prisma.todo.findMany({
    where: {
      userId: req.userId, // Se espera que el middleware de autenticación haya definido req.userId
    },
  });

  // Devuelve las tareas como respuesta en formato JSON
  res.json(todos);
});

// ==============================
// ➕ Crear una nueva tarea
// ==============================
router.post('/', async (req, res) => {
  const { task } = req.body; // Extrae el contenido de la tarea desde el cuerpo de la petición

  // Crea una nueva tarea asociada al usuario autenticado
  const todo = await prisma.todo.create({
    data: {
      task, // Texto de la tarea
      userId: req.userId, // ID del usuario autenticado
    },
  });

  // Devuelve la tarea recién creada
  res.json(todo);
});

// ==============================
// ✏️ Actualizar una tarea existente
// ==============================
router.put('/:id', async (req, res) => {
  const { completed } = req.body; // Extrae el estado de completado desde el cuerpo
  const { id } = req.params; // Extrae el ID de la tarea desde los parámetros de la URL

  // Actualiza la tarea con el ID especificado, asegurando que pertenezca al usuario autenticado
  const updatedTodo = await prisma.todo.update({
    where: {
      id: parseInt(id), // Convierte el ID a número entero
      userId: req.userId, // Verifica que la tarea pertenezca al usuario
    },
    data: {
      completed: !!completed, // Asegura que el valor sea booleano
    },
  });

  // Devuelve la tarea actualizada
  res.json(updatedTodo);
});

// ==============================
// 🗑️ Eliminar una tarea
// ==============================
router.delete('/:id', async (req, res) => {
  const { id } = req.params; // Extrae el ID de la tarea desde los parámetros
  const userId = req.userId; // Obtiene el ID del usuario autenticado

  // Elimina la tarea si pertenece al usuario
  await prisma.todo.delete({
    where: {
      id: parseInt(id), // Convierte el ID a número
      userId, // Verifica propiedad del recurso
    },
  });

  // Devuelve un mensaje de confirmación
  res.send({ message: 'Todo deleted' });
});

// 🚀 Exportamos el router para que pueda ser usado en el servidor principal
export default router;
