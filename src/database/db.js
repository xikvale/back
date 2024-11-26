const { Pool } = require('pg');

// Configuración del pool de conexiones
const pool = new Pool({
  user: 'postgres',          // Cambia esto a tu usuario de PostgreSQL
  host: 'localhost',           // Cambia esto si tu base no está en localhost
  database: 'school',// Cambia esto al nombre de tu base de datos
  password: 'Valerias12',   // Cambia esto a tu contraseña de PostgreSQL
  port: 5432,                  // Puerto por defecto de PostgreSQL
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
