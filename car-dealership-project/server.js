// ============================================================
//  SpotLight Dealership — Backend Server
//  Stack: Node.js + Express + PostgreSQL (pg)
// ============================================================

const express = require('express');
const { Pool } = require('pg');
const cors    = require('cors');
const path    = require('path');

const app  = express();
const PORT = Number(process.env.PORT) || 3000;

// ── Middlewares ──────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// Servir los archivos estáticos del proyecto (HTML, CSS, JS, imágenes)
app.use(express.static(path.join(__dirname)));

// ── Conexión a PostgreSQL ────────────────────────────────────
/*
  La conexion sale del entorno, no del codigo.

  Antes estaba escrita a fuego: usuario, host, base y puerto 5432. Eso traia
  dos problemas. El chico: Postgres.app no siempre usa el 5432 —en esta maquina
  escucha en el 5433— y el servidor no conectaba sin editar el archivo. El
  grande: el dia que esto vaya a un servidor de verdad, la contrasena se
  escribiria aqui mismo y quedaria en el historial de git para siempre.

  Los valores de respaldo son los de desarrollo local, asi que sigue
  arrancando sin configurar nada. Ver .env.example.
*/
const pool = new Pool({
    user:     process.env.PGUSER     || process.env.USER,
    host:     process.env.PGHOST     || 'localhost',
    database: process.env.PGDATABASE || 'spotlight_dealership',
    password: process.env.PGPASSWORD || '',
    port:     Number(process.env.PGPORT) || 5432,
});

pool.connect()
    .then(() => console.log('✅  Conectado a PostgreSQL — spotlight_dealership'))
    .catch(err => console.error('❌  Error de conexión a PostgreSQL:', err.message));


// ════════════════════════════════════════════════════════════
//  RUTAS API
// ════════════════════════════════════════════════════════════

// ── GET /api/autos  →  devuelve el catálogo de autos ────────
app.get('/api/autos', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM autos ORDER BY id');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener autos' });
    }
});

// ── POST /api/compra  →  registra una compra ────────────────
//    Body esperado: { auto_id, nombre_cliente, email, telefono, metodo_pago, total }
app.post('/api/compra', async (req, res) => {
    const { auto_id, nombre_cliente, email, telefono, metodo_pago, total } = req.body;

    // Validación básica
    if (!nombre_cliente || !email || !telefono || !metodo_pago || !total) {
        return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    try {
        // 1. Insertar la compra
        const insert = await pool.query(
            `INSERT INTO compras (auto_id, nombre_cliente, email, telefono, metodo_pago, total)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING *`,
            [auto_id || null, nombre_cliente, email, telefono, metodo_pago, parseFloat(total)]
        );

        // 2. Reducir el stock del auto (si se proporcionó auto_id)
        if (auto_id) {
            await pool.query(
                'UPDATE autos SET stock = stock - 1 WHERE id = $1 AND stock > 0',
                [auto_id]
            );
        }

        res.status(201).json({
            mensaje: '¡Compra registrada exitosamente!',
            compra: insert.rows[0]
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al registrar la compra' });
    }
});

// ── GET /api/compras  →  historial de todas las compras ─────
app.get('/api/compras', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT c.id, a.marca, a.modelo, c.nombre_cliente,
                   c.email, c.telefono, c.metodo_pago,
                   c.total, c.fecha
            FROM compras c
            LEFT JOIN autos a ON c.auto_id = a.id
            ORDER BY c.fecha DESC
        `);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener compras' });
    }
});


// ── Ruta raíz → sirve searchCars.html ───────────────────────
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'searchCars.html'));
});


// ── Iniciar servidor ─────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`🚗  SpotLight Server corriendo en → http://localhost:${PORT}`);
    console.log(`📋  Ver compras            → http://localhost:${PORT}/api/compras`);
    console.log(`🚘  Ver catálogo de autos  → http://localhost:${PORT}/api/autos`);
});
