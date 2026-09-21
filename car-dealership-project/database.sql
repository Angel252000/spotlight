-- ============================================================
--  SpotLight Car Dealership — Base de Datos
-- ============================================================

-- Crear la base de datos (ejecutar por separado si no existe)
-- CREATE DATABASE spotlight_dealership;

-- ── TABLA: autos (catálogo de vehículos) ──────────────────────────
CREATE TABLE IF NOT EXISTS autos (
    id        SERIAL PRIMARY KEY,
    marca     VARCHAR(80)    NOT NULL,
    modelo    VARCHAR(80)    NOT NULL,
    precio    NUMERIC(12,2)  NOT NULL,
    imagen    VARCHAR(200),
    stock     INT            NOT NULL DEFAULT 1
);

-- ── TABLA: compras ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS compras (
    id              SERIAL PRIMARY KEY,
    auto_id         INT            REFERENCES autos(id),
    nombre_cliente  VARCHAR(120)   NOT NULL,
    email           VARCHAR(120)   NOT NULL,
    telefono        VARCHAR(30)    NOT NULL,
    metodo_pago     VARCHAR(30)    NOT NULL,
    total           NUMERIC(12,2)  NOT NULL,
    fecha           TIMESTAMP      DEFAULT NOW()
);

-- ── Catálogo de autos ─────────────────────────────────────────────
INSERT INTO autos (marca, modelo, precio, imagen, stock) VALUES
    ('Tesla',   'Model X',     98900.00, 'assets/img/featured1.png', 5),
    ('Tesla',   'Model 3',     45900.00, 'assets/img/featured2.png', 8),
    ('Audi',    'E-tron',     175900.00, 'assets/img/featured3.png', 3),
    ('Porsche', 'Boxster 987',126900.00, 'assets/img/featured4.png', 4),
    ('Porsche', 'Panamera',   126900.00, 'assets/img/featured5.png', 4);

-- ── Ver todos los autos ───────────────────────────────────────────
SELECT * FROM autos;

-- ── Ver todas las compras con datos del auto ──────────────────────
SELECT c.id, a.marca, a.modelo, c.nombre_cliente,
       c.email, c.telefono, c.metodo_pago,
       c.total, c.fecha
FROM compras c
LEFT JOIN autos a ON c.auto_id = a.id
ORDER BY c.fecha DESC;
