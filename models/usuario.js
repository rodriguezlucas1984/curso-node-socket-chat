const { Schema, model } = require("mongoose");

const UsuarioSchema = Schema({
  nombre: {
    type: String,
    required: [true, "El nombre es requerido"],
  },
  correo: {
    type: String,
    required: [true, "El correo es requerido"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "La contarseña  es obligatoria"],
  },
  img: {
    type: String,
  },
  rol: {
    type: String,
    default:'USER_ROLE',
    required: true,
  },

  estado: {
    type: Boolean,
    default: true,
  },

  google: {
    type: Boolean,
    default: false,
  },
});

//Para no mostrar en la respuesta el password
UsuarioSchema.methods.toJSON = function () {
  //Debe ser una funcion clasica para que tenga contexto de ejeción propio
  //En una función de flecha el objeto this apuntaria a UsuarioSchema
  const { __v, password, _id, ...usuario } = this.toObject();
  usuario.uid = _id;
  return usuario;
};

module.exports = model("Usuario", UsuarioSchema);
