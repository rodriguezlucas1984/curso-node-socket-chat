const { response, request } = require("express");
const { Producto } = require("../models");

//get
obtenerProductos = async (req = request, res = response) => {
  const { limite = 5, desde = 0 } = req.query;
  const query = { estado: true };

  const [total, productos] = await Promise.all([
    Producto.countDocuments(query),
    Producto.find(query)
      .skip(Number(desde))
      .limit(Number(limite))
      .populate("usuario", "nombre")
      .populate("categoria", "nombre"),
  ]);

  return res.status(200).json({ total, productos });
};

//get id
const obtenerProducto = async (req = request, res = response) => {
  const { id } = req.params;
  const producto = await Producto.findById(id)
    .populate("usuario", "nombre")
    .populate("categoria", "nombre");
  return res.status(200).json(producto);
};

//post
crearProducto = async (req = request, res = response) => {
  const usuario = req.usuario._id;
  const { categoria, nombre, descripcion, precio = 0 } = req.body;

  if (precio && isNaN(precio)) {
    return res.status(400).json({ msg: "El precio debe ser numerico" });
  }
  if (precio && precio < 0) {
    return res.status(400).json({ msg: "El precio debe ser positivo" });
  }

  const producto = new Producto({
    categoria,
    nombre: nombre.toUpperCase(),
    descripcion,
    precio,
    usuario,
  });
  await producto.save();

  return res.status(201).json(producto);
};

//put
actualizarProducto = async (req = request, res = response) => {
  const { id } = req.params;
  const { categoria, nombre, descripcion, precio = 0 } = req.body;

  //Existe nombre
  const productoDB = await Producto.findOne({ nombre, _id: { $ne: id } });
  if (productoDB) {
    return res
      .status(400)
      .json({ msg: `El producto ${productoDB.nombre} ya existe` });
  }

  const producto = await Producto.findByIdAndUpdate(
    id,
    {
      categoria,
      nombre: nombre.toUpperCase(),
      descripcion,
      precio,
    },
    { new: true }
  )
    .populate("usuario", "nombre")
    .populate("categoria", "nombre");

  return res.status(200).json(producto);
};

//delete
const borrarProducto = async (req = request, res = response) => {
  const { id } = req.params;
  const producto = await Producto.findByIdAndUpdate(
    id,
    { estado: false },
    { new: true }
  )
    .populate("usuario", "nombre")
    .populate("categoria", "nombre");

  return res.status(200).json(producto);
};

module.exports = {
  actualizarProducto,
  borrarProducto,
  crearProducto,
  obtenerProducto,
  obtenerProductos,
};
