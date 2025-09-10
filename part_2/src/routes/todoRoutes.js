// Importa Express para crear rutas HTTP
import express from 'express';
// Importa la instancia de base de datos (probablemente SQLite)
import db from '../db.js';

// Crea un router modular para manejar rutas relacionadas con "todos"
const router = express.Router();

// ==============================
// Obtener todas las tareas del usuario autenticado
// ==============================
router.get('/', (req, res) => {
  // Prepara una consulta SQL para obtener todos los todos del usuario actual
  const getTodos = db.prepare('SELECT * FROM todos WHERE id_user = ?');

  // Ejecuta la consulta con el ID del usuario extraído del token
  const todos = getTodos.all(req.userId);

  // Devuelve los todos como JSON
  res.json(todos);
});

// ==============================
// Crear una nueva tarea
// ==============================
router.post('/', (req, res) => {
  // Extrae el campo 'task' del cuerpo de la solicitud
  const { task } = req.body;

  // Prepara una consulta SQL para insertar una nueva tarea
  const insertTodo = db.prepare(`INSERT INTO todos (id_user, task) VALUES (?, ?)`);

  // Ejecuta la inserción con el ID del usuario y la tarea
  const result = insertTodo.run(req.userId, task);

  // Devuelve el nuevo todo con su ID generado y estado inicial (no completado)
  res.json({ id: result.lastInsertRowid, task, completed: 0 });
});

// ==============================
// Actualizar el estado de una tarea
// ==============================
router.put('/:id', (req, res) => {
  // Extrae el nuevo estado 'completed' del cuerpo
  const { completed } = req.body;

  // Extrae el ID de la tarea desde los parámetros de la URL
  const { id } = req.params;

  // Extrae parámetros opcionales (no usados aquí)
  const { page } = req.query;

  // Prepara una consulta SQL para actualizar el estado de la tarea
  const updatedTodo = db.prepare('UPDATE todos SET completed = ? WHERE id = ?');

  // Ejecuta la actualización
  updatedTodo.run(completed, id);

  // Devuelve una respuesta de éxito
  res.json({ message: 'Todo completed' });
});

// ==============================
// Eliminar una tarea
// ==============================
router.delete('/:id', (req, res) => {
  // Extrae el ID de la tarea desde los parámetros de la URL
  const { id } = req.params;

  // Extrae el ID del usuario desde el token
  const userId = req.userId;

  // Prepara una consulta SQL para eliminar la tarea si pertenece al usuario
  const deleteTodo = db.prepare(`DELETE FROM todos WHERE id = ? AND id_user = ?`);

  // Ejecuta la eliminación
  deleteTodo.run(id, userId);

  // Devuelve una respuesta de éxito
  res.send({ message: 'Todo deleted' });
});

// Exporta el router para que pueda ser usado en el servidor principal
export default router;
