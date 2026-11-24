const mongoose = require("mongoose");

const tareaSchema = new mongoose.Schema(
  {
    titulo: {
      type: String,
      required: [true, "El título es obligatorio"],
      trim: true,
      maxlength: [120, "El título no puede pasar de 120 caracteres"],
    },
    completada: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Tarea", tareaSchema);
