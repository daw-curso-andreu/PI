require("dotenv").config();

const path = require("node:path");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const tareasRouter = require("./routes/tareas");

const app = express();
const uri = process.env.MONGODB_URI?.trim();
const PORT = Number(process.env.PORT || 3000);

if (!uri) {
  console.error("Falta MONGODB_URI: crea .env a partir de .env.example");
  process.exit(1);
}

if (!Number.isInteger(PORT) || PORT < 1 || PORT > 65535) {
  console.error("PORT debe ser un entero entre 1 y 65535");
  process.exit(1);
}

app.use(cors());
app.use(express.json({ limit: "100kb" }));
app.use(express.static(path.join(__dirname, "..", "frontend")));
app.use("/api/tareas", tareasRouter);

app.use("/api", (req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

app.use((req, res) => {
  res.status(404).send("Página no encontrada");
});

app.use((error, req, res, next) => {
  let status = 500;
  let message = "Error interno del servidor";

  if (error.type === "entity.parse.failed") {
    status = 400;
    message = "El cuerpo de la petición no es un JSON válido";
  } else if (error.type === "entity.too.large") {
    status = 413;
    message = "El cuerpo de la petición es demasiado grande";
  } else if (error.name === "ValidationError") {
    status = 400;
    message = Object.values(error.errors)
      .map((detail) => detail.message)
      .join(". ");
  } else if (error.name === "CastError") {
    status = 400;
    message = "Dato o identificador no válido";
  } else {
    console.error(error);
  }

  res.status(status).json({ error: message });
});

async function iniciar() {
  try {
    await mongoose.connect(uri);
    app.listen(PORT, () => {
      console.log(`Servidor en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("No se ha podido conectar a MongoDB:", error.message);
    process.exit(1);
  }
}

iniciar();
