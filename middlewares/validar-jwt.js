const jwt = require("jsonwebtoken");
const { request, response } = require("express");
const Usuario = require("../models/usuario");

const validarJWT = async (req = request, res = response, next) => {
  const token = req.header("x-token");
  if (!token) {
    return res.status(401).json({
      msg: "No hay token en la petición",
    });
  }

  try {
    const { uid } = jwt.verify(token, process.env.SECRETORPRIVETKEY);
    //leer el usuario que corresponde al uid
    const usuario = await Usuario.findById(uid);

    //Verificar existencia del usuario
    if (!usuario) {
      return res.status(401).json({
        msg: "Token no valido - usuario inexistente en DB",
      });
    }

    //Verificar si el usuario no tiene su estado en false
    if (!usuario.estado) {
      return res.status(401).json({
        msg: "Token no valido - usuario con estado:false",
      });
    }

    req.usuario = usuario;

    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({
      msg: "Token no valido",
    });
  }
};

module.exports = {
  validarJWT,
};
