# CLAUDE.md

SpotLight: sitio de un concesionario de vehículos eléctricos. Frontend estático +
API Express sobre PostgreSQL. Todo el código vive en `car-dealership-project/`.

## Stack

- Node >= 20.12, Express 5, `pg`, `cors` (CommonJS)
- PostgreSQL 14+
- Frontend sin framework: HTML/CSS/JS con Swiper, MixItUp y ScrollReveal (minificados en `assets/js/`)
- Vídeos de fondo por Git LFS (`.gitattributes`)

## Archivos

| Archivo | Rol |
|---|---|
| `server.js` | API (`/api/autos`, `/api/compra`, `/api/compras`) y servidor de estáticos de toda la carpeta |
| `database.sql` | Esquema de `autos` y `compras`. No trae datos |
| `.env.example` | Variables `PG*` y `PORT`. `server.js` carga `.env` con `process.loadEnvFile` |
| `searchCars.html` + `assets/js/apiJS.js` | Catálogo: pide `/api/autos`, filtra y envía la compra |
| `assets/js/360deg.js` | Vista 360° (44 fotos en `assets/img/360/`) |
| `index.html`, `customize.html`, `testdrive.html`, `about.html` | Resto de páginas, estáticas |
| `assets/js/carapi2.js`, `assets/js/server/` | Prototipos viejos; ninguna página los carga |

## Comandos

```bash
cd car-dealership-project
npm install
npm start          # http://localhost:3000
```

No hay tests ni linter.

## Gotchas

- Postgres.app puede escuchar en el **5433**, no en el 5432. Si arranca pero no
  conecta, es eso: ajustar `PGPORT` en `.env`.
- `POST /api/compra` hace INSERT y luego UPDATE de stock **sin transacción**.
- `GET /api/compras` devuelve datos personales de clientes sin autenticación.
  Solo para desarrollo local.
- `express.static` sirve toda la carpeta del proyecto. Los dotfiles (`.env`)
  quedan fuera por el valor por defecto `dotfiles: 'ignore'`; no cambiarlo.
- Si la página se ve negra y vacía, es ScrollReveal (opacidad 0 hasta hacer scroll).
- Clonar sin `git lfs install` deja los `.mp4` como punteros de texto.
- Nunca escribir credenciales en `server.js`: van en `.env`, que está en `.gitignore`.
