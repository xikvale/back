const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const cors = require('cors'); // Importar CORS

const app = express();

app.use(cors({
  origin: '*', // Cambia esto por el dominio del frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
  allowedHeaders: ['Content-Type', 'Authorization'], // Headers permitidos
}));

// Middleware
app.use(bodyParser.json());

// Rutas
app.use('/api', authRoutes);

module.exports = app;
