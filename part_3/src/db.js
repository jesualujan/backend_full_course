// Importamos la clase DatabaseSync desde el módulo nativo experimental de SQLite en Node.js
import { DatabaseSync } from 'node:sqlite';
// Creamos una base de datos en memoria (no se guarda en disco, útil para pruebas o prototipos)
const db = new DatabaseSync(':memory:');

// Ejecutamos una sentencia SQL para crear la tabla de usuarios
db.exec(`
  CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,  -- Identificador único autoincremental
    username TEXT UNIQUE,                  -- Nombre de usuario único
    password TEXT                          -- Contraseña en texto plano (⚠️ solo para pruebas, no recomendado en producción)
  );
`);

// Ejecutamos otra sentencia SQL para crear la tabla de tareas (todos)
db.exec(`
  CREATE TABLE todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,  -- Identificador único autoincremental
    id_user INTEGER,                       -- ID del usuario que creó la tarea
    task TEXT,                             -- Descripción de la tarea
    completed BOOLEAN DEFAULT 0,           -- Estado de la tarea (0 = incompleta, 1 = completada)
    FOREIGN KEY (id_user) REFERENCES users(id) -- Relación con la tabla de usuarios
  );
`);

// Exportamos la instancia de la base de datos para usarla en otros módulos
export default db;
