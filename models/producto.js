const { model, Schema } = require("mongoose");

const ProductoSchema = Schema({
  nombre: {
    type: String,
    required: [true, "El nombre es obligatorio"],
    unique: true,
  },
  usuario: {
    type: Schema.Types.ObjectId,
    ref: "Usuario",
    required: true,
  },
  precio: {
    type: Number,
    default: 0,
    required: false,
  },
  categoria: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Categoria",
  },
  estado: {
    type: Boolean,
    required: true,
    default: true,
  },
  descripcion: {
    type: String,
  },

  disponible: {
    type: Boolean,
    default: true,
  },
  img: { type: String },
});

ProductoSchema.methods.toJSON = function () {
  const { __v, estado, ...data } = this.toObject();

  return data;
};

module.exports = model("Producto", ProductoSchema);
