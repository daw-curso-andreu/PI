# Lista de tareas

Aplicación web sencilla para gestionar tareas: añadir, marcar como hecha, filtrar y borrar.

- **Frontend:** HTML + CSS + JavaScript (DOM)
- **Backend:** Node.js + Express
- **Base de datos:** MongoDB (con Mongoose)

## Requisitos

- [Node.js](https://nodejs.org/) 18 o superior (recomendado 20+).
- Una base de datos MongoDB: local o en [MongoDB Atlas](https://www.mongodb.com/atlas) (plan gratuito).

## Instalación y puesta en marcha

1. Clona el repositorio:

   ```bash
   git clone https://github.com/USUARIO/PI.git
   cd PI
   ```

2. Instala las dependencias:

   ```bash
   npm install
   ```

3. Crea el archivo `.env` a partir del ejemplo y rellénalo:

   ```bash
   cp .env.example .env
   ```

   | Variable | Descripción | Ejemplo |
   |---|---|---|
   | `PORT` | Puerto del servidor | `3000` |
   | `MONGODB_URI` | Cadena de conexión a MongoDB | `mongodb://127.0.0.1:27017/tareas` |

4. Arranca el servidor:

   ```bash
   node server.js
   ```

   Para desarrollo (reinicia al guardar): `npm run dev`.

5. Abre el navegador en **http://localhost:3000**.

## API

Base: `/api/tareas`

| Método | Ruta | Cuerpo (JSON) | Descripción |
|---|---|---|---|
| GET | `/api/tareas` | – | Lista todas las tareas |
| POST | `/api/tareas` | `{ "titulo": "..." }` | Crea una tarea |
| PUT | `/api/tareas/:id` | `{ "completada": true }` | Actualiza una tarea |
| DELETE | `/api/tareas/:id` | – | Borra una tarea |