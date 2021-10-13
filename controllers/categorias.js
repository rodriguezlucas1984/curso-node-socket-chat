const { response, request } = require("express");

const { Categoria, Usuario } = require("../models");

// obtenerCategorias - paginado - total - populate
const obtenerCategorias = async (req = request, res = response) => {
  const { limite = 5, desde = 0 } = req.query;
  const query = { estado: true };

  //Ejecución de la consulta de busqueda y conteo en simultaneo
  const [total, categorias] = await Promise.all([
    Categoria.countDocuments(query),
    Categoria.find(query)
      .skip(Number(desde))
      .limit(Number(limite))
      .populate("usuario", "nombre"),
  ]);
  res.json({
    total,
    categorias,
  });
};

// obtenerCategoria - populate {}
const obtenerCatgoria = async (req = request, res = response) => {
  const { id } = req.params;

  const categoria = await Categoria.findById(id).populate("usuario", "nombre");

  res.status(200).json({ categoria });
};

const crearCategoria = async (req = request, res = response) => {
  const nombre = req.body.nombre.toUpperCase();

  const categoriaDB = await Categoria.findOne({ nombre });

  if (categoriaDB) {
    return res
      .status(400)
      .json({ msg: `La categoria ${categoriaDB.nombre} ya existe` });
  }

  //Generar la data a guardar
  const data = { nombre, usuario: req.usuario._id };

  const categoria = new Categoria(data);

  //Guardar DB
  await categoria.save();

  res.status(201).json(categoria);
};

// actualizar categoria
const actualizarCategoria = async (req = request, res = response) => {
  const { id } = req.params;
  let { nombre } = req.body;
  nombre = nombre.toUpperCase();

  //Existe ya ese nombre
  const categoriaDB = await Categoria.findOne({ _id: { $ne: id }, nombre });
  if (categoriaDB) {
    return res
      .status(400)
      .json({ msg: `La categoria ${categoriaDB.nombre} ya existe` });
  }

  const categoria = await Categoria.findByIdAndUpdate(
    id,
    { nombre },
    { new: true }
  );

  return res.status(200).json(categoria);
};

//borrar categoria -estado:false
const borrarCategoria = async (req = request, res = response) => {
  const { id } = req.params;

  const categoria = await Categoria.findByIdAndUpdate(
    id,
    { estado: false },
    { new: true }
  );

  res.status(200).json({ categoria });
};

module.exports = {
  crearCategoria,
  obtenerCategorias,
  obtenerCatgoria,
  actualizarCategoria,
  borrarCategoria,
};
