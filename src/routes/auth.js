const express = require('express');
const router = express.Router();
const db = require('../database/db');
const { v4: uuidv4 } = require('uuid'); // Importar el generador de UUID

// POST /login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña son requeridos' });
  }

  try {
    const query = `
      SELECT 1 
      FROM usuario 
      WHERE correo ILIKE $1 AND contraseña = $2
    `;
    const values = [email, password];
    const result = await db.query(query, values);
    const isAuthorized = result.rowCount > 0;

    if (isAuthorized) {
      // OBTENERE EL ID Y TIPO DE USUARIO
      const query = `
        SELECT usuarioid, tipousuario
        FROM usuario
        WHERE correo ILIKE $1 AND contraseña = $2
      `;

      const result = await db.query(query, values);
      const { usuarioid, tipousuario } = result.rows[0];
      res.json({ isAuthorized, usuarioid, tipousuario });
      return
    }

    res.json({ isAuthorized });
  } catch (error) {22
    console.error('Error al consultar la base de datos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// POST /crear-usuario
router.post('/crear-usuario', async (req, res) => {
  const {
    rut,
    nombres,
    apellidos,
    contraseña,
    correo,
    tipoUsuario,
    colegioId
  } = req.body;

  // Validar campos obligatorios
  if (!rut || !nombres || !apellidos || !contraseña || !correo || !tipoUsuario) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  try {
    // Verificar si ya existe un usuario con el mismo RUT o correo
    const existsQuery = `
      SELECT 1 
      FROM usuario 
      WHERE rut = $1 OR correo = $2
    `;
    const existsResult = await db.query(existsQuery, [rut, correo]);

    if (existsResult.rowCount > 0) {
      return res.status(409).json({ error: 'Ya existe un usuario con este RUT o correo' });
    }

    // Insertar el nuevo usuario en la base de datos
    const usuarioid = uuidv4();

    const insertQuery = `
      INSERT INTO usuario (usuarioid, rut, nombres, apellidos, contraseña, correo, tipousuario, colegioid)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`;
    const values = [usuarioid, rut, nombres, apellidos, contraseña, correo, tipoUsuario, colegioId];

    const insertResult = await db.query(insertQuery, values);

    // Devolver los datos del usuario creado
    res.status(201).json({
      message: 'Usuario creado exitosamente',
      usuarioid,
      usuario: insertResult.rows[0]
    });
  } catch (error) {
    console.error('Error al crear usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /usuarios
router.get('/usuarios', async (req, res) => {
  try {
    // Consulta a la base de datos
    const query = `
      SELECT	usuarioid,
              rut,
              nombres,
              apellidos,
              contraseña,
              correo,
              tipousuario,
              colegioid
      FROM usuario
      ORDER BY rut DESC
    `;

    const result = await db.query(query);

    // Responder con la lista de usuarios
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener la lista de usuarios:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});



module.exports = router;
