const { response, request } = require("express");
const bcryptjs = require("bcryptjs");

const Usuario = require("../models/usuario");
const usuario = require("../models/usuario");

const usuarioGet = async (req = request, res = response) => {
  const { limite = 5, desde = 0 } = req.query;
  const query = { estado: true };
  //Ejecución de la consulta de busqueda y conteo en simultaneo
  const [total, usuarios] = await Promise.all([
    Usuario.countDocuments(query),
    Usuario.find(query).skip(Number(desde)).limit(Number(limite)),
  ]);
  res.json({
    total,
    usuarios,
  });
};

const usuarioPost = async (req = request, res = response) => {
  const { nombre, correo, password, rol } = req.body;
  const usuario = new Usuario({ nombre, correo, password, rol });

  //Encriptar la contrarseña
  const salt = bcryptjs.genSaltSync();
  usuario.password = bcryptjs.hashSync(password, salt);
  //Guardar en BD
  await usuario.save();

  res.json({
    usuario,
  });
};

const usuarioPut = async (req = request, res = response) => {
  const { id } = req.params;
  const { _id, password, google, correo, ...resto } = req.body;

  //TODO validar contra la base de datos
  if (password) {
    const salt = bcryptjs.genSaltSync();
    resto.password = bcryptjs.hashSync(password, salt);
  }
  const usuario = await Usuario.findByIdAndUpdate(id, resto);
  res.json({
    usuario,
  });
};
const usuarioPatch = (req = request, res = response) => {
  res.json({
    msg: "patch API-controlador",
  });
};

const usuarioDelete = async (req = request, res = response) => {
  const { id } = req.params;
  const usuario = await Usuario.findByIdAndUpdate(id, { estado: false });
  if (usuario.rol === "TEST_ROLE") {
    //Fisicamente lo borramos
    await Usuario.findByIdAndDelete(id);
  }

  res.json({
    usuario,
  });
};

module.exports = {
  usuarioGet,
  usuarioPatch,
  usuarioPost,
  usuarioDelete,
  usuarioPut,
};
