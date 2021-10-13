const { response, request } = require("express");
const bcryptjs = require("bcryptjs");

const Usuario = require("../models/usuario");

const { generarJWT } = require("../helpers/generar-jwt");

const { googleVerify } = require("../helpers/google-verify");

const login = async (req = request, res = response) => {
  const { correo, password } = req.body;
  try {
    //Verificar si el email existe
    const usuario = await Usuario.findOne({ correo });
    if (!usuario) {
      return res.status(400).json({
        msg: "El usuario/password son incorectos - correo",
      });
    }

    // Si el usuario esta activo
    if (!usuario.estado) {
      return res.status(400).json({
        msg: "El usuario/password son incorectos - estado:false",
      });
    }

    //Verificar la contraseña
    const validPassword = bcryptjs.compareSync(password, usuario.password);
    if (!validPassword) {
      return res.status(400).json({
        msg: "El usuario/password son incorectos - password",
      });
    }

    //Generar el JWT
    const token = await generarJWT(usuario.id);

    res.json({ usuario, token });
  } catch (error) {
    return res.status(500).json({
      msg: "Hable con el administrador",
      error,
    });
  }
};

const googleSingin = async (req = request, res = response) => {
  const { id_token } = req.body;
  try {
    const { correo, img, nombre } = await googleVerify(id_token);
    let usuario = await Usuario.findOne({ correo });

    if (!usuario) {
      //Tengo que crearlo
      const data = {
        nombre,
        correo,
        password: ":P",
        img,
        google: true,
      };

      usuario = new Usuario(data);
      await usuario.save();
    }

    //Si usuario en DB
    if (!usuario.estado) {
      return res.status(401).json({
        msg: "Hable con el administrador, usuario bloqueado",
      });
    }

    const token = await generarJWT(usuario.id);

    res.json({
      usuario,
      token,
    });
  } catch (error) {
    res.status(400).json({
      msg: "Token de Google no es válido",
    });
  }
};

const renovarToken = async (req, res = response) => {
  const { usuario } = req;

  //Generar el JWT
  const token = await generarJWT(usuario.id);

  res.json({
    usuario,
    token,
  });
};

module.exports = {
  login,
  googleSingin,
  renovarToken,
};
