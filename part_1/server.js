import express from 'express';
import colors from 'colors';

const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(express.json()); // Para poder usar req.body
app.use(express.urlencoded({ extended: true })); // enviar mis solicitudes con formularios en el body

// let data = {
//   name: 'John Doe',
//   email: 'johndoe@gmail.com',
//   message: 'Hello from the server',
//   date: new Date().toLocaleString(),
// };

let data = [
  {
    name: 'John Doe',
    email: 'johndoe@gmail.com',
    age: 31,
    city: 'Mexico city',
    ocupation: 'Software Engineer',
    message: 'Hello from the server',
    date: new Date().toLocaleString(),
  },
];

// RUTAS
// TYPE 1: RUTAS WEB  (visual)
app.get('/', (req, res) => {
  console.log('Usuario accendio al home');
  res.send(`<body
    style="display: flex; flex-direction: column; align-items: center;"
    justify-content: center; height: 100vh;" font-family: Arial, sans-serif;
    background-color: #f0f0f0;>
    <h1 style="color: #333;">¡Bienvenido a la pagina de inicio!</h1>
    <p>
    <h2>DATA: </h2>
    ${JSON.stringify(data)}
    </p>
    </body>`);
});

app.get('/dashboard', (req, res) => {
  res.send('<h1>Dashboard</h1>');
});

// TYPE 2: RUTAS API ( non visual)
//CRUD
app.get('/api/data', (req, res) => {
  console.log('Usuario accendio a /api/data');
  res.status(200).json(data);
});

app.get('/api/users', (req, res) => {
  console.log('No hay usuarios en la base de datos');
  res.status(404).json({ error: 'Not Found' });
});

app.post('/api/data', (req, res) => {
  // Tomamos el body del request
  const newEntry = req.body.map((item) => ({
    ...item,
    date: new Date().toISOString(), // Agregamos la fecha actual a cada objeto
  }));
  // Guardamos los datos
  data.push(...newEntry); // Si data es un array global
  console.log(newEntry);
  // Respondemos
  res.status(201).send({
    message: 'Data creada satisfactoriamente',
    data: newEntry,
  });
});

app.listen(port, () => {
  console.log(colors.bgGreen(`Servidor corriendo en http://localhost:${port}`));
});
