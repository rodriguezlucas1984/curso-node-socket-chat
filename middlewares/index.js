const validarCampos = require("../middlewares/validadar-campos");
const validarJWT = require("../middlewares/validar-jwt");
const validarRoles = require("../middlewares/validar-roles");
const validarArchivo = require("../middlewares/validar-archivo");

module.exports = {
  ...validarRoles,
  ...validarJWT,
  ...validarCampos,
  ...validarArchivo,
};
