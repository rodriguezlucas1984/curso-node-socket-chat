const { request, response } = require("express");
const { ObjectId } = require("mongoose").Types;

const { Categoria, Usuario, Producto, Role } = require("../models");

const coleccionesPermitidas = ["categorias", "productos", "roles", "usuarios"];

const buscarCategorias = async (termino = "", res = response) => {
  const esMongoId = ObjectId.isValid(termino);
  if (esMongoId) {
    const categoria = await Categoria.findById(termino);

    return res.status(200).json({ results: categoria ? [categoria] : [] });
  }

  const regexp = new RegExp(termino, "i");
  const categorias = await Categoria.find({ nombre: regexp, estado: true });

  return res.status(200).json({ results: categorias });
};

const buscarProducto = async (termino = "", res = response) => {
  const esMongoId = ObjectId.isValid(termino);
  if (esMongoId) {
    const producto = await Producto.findById(termino)
      .populate("categoria", "nombre")
      .populate("usuario", "nombre");
    return res.status(200).json({ results: producto ? [producto] : [] });
  }
  const regexp = new RegExp(termino, "i");
  const productos = await Producto.find({
    $or: [{ nombre: regexp }, { descripcion: regexp }],
    $and: [{ estado: true }],
  })
    .populate("categoria", "nombre")
    .populate("usuario", "nombre");

  return res.status(200).json({ results: productos });
};

const buscarRole = async (termino = "", res = response) => {
  const esMongoID = ObjectId.isValid(termino);
  if (esMongoID) {
    const role = await Role.findById(termino);
    return res.status(200).json({ results: role ? [role] : [] });
  }
  const regexp = new RegExp(termino, "i");
  const roles = await Role.find({ rol: regexp });
  return res.status(200).json({ results: roles });
};

const buscarUsuario = async (termino = "", res = response) => {
  const esMongoID = ObjectId.isValid(termino);

  if (esMongoID) {
    const usuario = await Usuario.findById(termino);
    return res.status(200).json({ results: usuario ? [usuario] : [] });
  }

  const regex = new RegExp(termino, "i");

  const usuarios = await Usuario.find({
    $or: [{ nombre: regex }, { correo: regex }],
    $and: [{ estado: true }],
  });

  return res.status(200).json({ results: usuarios });
};

const buscar = (req = request, res = response) => {
  const { coleccion, termino } = req.params;

  if (!coleccionesPermitidas.includes(coleccion)) {
    return res.status(400).json({
      msg: `Las colecciones permitidas son: ${coleccionesPermitidas}`,
    });
  }

  switch (coleccion) {
    case "categorias":
      buscarCategorias(termino, res);
      break;
    case "productos":
      buscarProducto(termino, res);
      break;

    case "usuarios":
      buscarUsuario(termino, res);
      break;

    case "roles":
      buscarRole(termino, res);
      break;
  }
};

module.exports = {
  buscar,
};
