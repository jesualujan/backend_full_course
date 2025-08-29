import express from 'express';
import colors from 'colors';

const app = express();
const PORT = process.env.PORT || 3001;

// RUTA PRINCIPAL: sirve el archivo index.html desde la carpeta /public
app.get('/', (req, res) => {
  res.send('bienvenido al servidor');
});

// Iniciamos el servidor y mostramos un mensaje en consola
app.listen(PORT, () => {
  console.log(
    colors.bgMagenta(`Servidor escuchando en
    http://localhost:${PORT}`)
  );
});
