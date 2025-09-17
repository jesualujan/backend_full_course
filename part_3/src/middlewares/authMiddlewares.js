// 🧠 ¿Qué hace este middleware?
// Protege rutas que requieren autenticación.
// Verifica que el token JWT sea válido.
// Extrae el userId del token y lo adjunta a req para que esté disponible en las rutas.
// Si el token no existe o es inválido, corta la ejecución y responde con un error.

// Importa la librería jsonwebtoken para verificar tokens JWT
import jwt from 'jsonwebtoken';

// Middleware de autenticación para proteger rutas privadas
function authMiddleware(req, res, next) {
  // Extrae el token del encabezado Authorization
  const token = req.headers['authorization'];

  // Si no se proporciona token, responde con error 401 (no autorizado)
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  // Verifica el token usando la clave secreta definida en el archivo .env
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    // Si el token es inválido o expiró, responde con error 401
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    // Si el token es válido, extrae el ID del usuario del payload
    req.userId = decoded.id;

    // Continúa con la siguiente función o ruta protegida
    next();
  });
}

// Exporta el middleware para que pueda usarse en rutas protegidas
export default authMiddleware;
