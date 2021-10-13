const { Router } = require("express");
const { check } = require("express-validator");

const { login, googleSingin, renovarToken } = require("../controllers/auth");
const { validarCampos, validarJWT } = require("../middlewares/");

const router = Router();

router.post(
  "/login",
  [
    check("correo", "El correo es obligatorio").isEmail(),
    check("password", "La contraseña es obligatoria").notEmpty(),
    validarCampos,
  ],
  login
);

router.post(
  "/google",
  [check("id_token", "Es el id_token es necesario").notEmpty(), validarCampos],
  googleSingin
);

router.get("/", validarJWT, renovarToken);

module.exports = router;
