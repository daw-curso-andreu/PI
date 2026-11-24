const express = require("express");
const Tarea = require("../models/Tarea");

const router = express.Router();

// GET /api/tareas
router.get("/", async (req, res, next) => {
  try {
    const tareas = await Tarea.find().sort({ createdAt: -1 });
    res.json(tareas);
  } catch (error) {
    next(error);
  }
});

// POST /api/tareas
router.post("/", async (req, res, next) => {
  try {
    const tarea = await Tarea.create({ titulo: req.body.titulo });
    res.status(201).json(tarea);
  } catch (error) {
    next(error);
  }
});

// PUT /api/tareas/:id
router.put("/:id", async (req, res, next) => {
  try {
    const cambios = {};
    if (typeof req.body.completada === "boolean") cambios.completada = req.body.completada;
    if (typeof req.body.titulo === "string") cambios.titulo = req.body.titulo;

    const tarea = await Tarea.findByIdAndUpdate(req.params.id, cambios, {
      new: true,
      runValidators: true,
    });
    if (!tarea) return res.status(404).json({ error: "Tarea no encontrada" });
    res.json(tarea);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/tareas/:id
router.delete("/:id", async (req, res, next) => {
  try {
    const tarea = await Tarea.findByIdAndDelete(req.params.id);
    if (!tarea) return res.status(404).json({ error: "Tarea no encontrada" });
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
