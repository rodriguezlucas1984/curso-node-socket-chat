const { Router } = require("express");
const { check } = require("express-validator");

const {
  validarCampos,
  validarJWT,
  tieneRole,
  esAdminRole,
} = require("../middlewares");

const {
  esRoleValido,
  emailExiste,
  existeUsuarioPorId,
} = require("../helpers/db.validators");
const router = Router();

const {
  usuarioGet,
  usuarioPut,
  usuarioPost,
  usuarioDelete,
  usuarioPatch,
} = require("../controllers/usuarios");

router.get(
  "/",
  [
    check("limite", "El parametro 'limite' debe ser un numero ").isNumeric(),
    check("desde", "El parametro 'desde' debe ser un numero ").isNumeric(),
    validarCampos,
  ],
  usuarioGet
);
router.put(
  "/:id",
  [
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(existeUsuarioPorId),
    check("rol").custom(esRoleValido),
    validarCampos,
  ],
  usuarioPut
);
router.post(
  "/",
  [
    check("correo", "El correo no es valido").isEmail(),
    check("correo").custom(emailExiste),
    check("nombre", "El nombre es obligatorio").notEmpty(),
    check("password", "El password debe tener mas de 6 caracteres").isLength({
      min: 6,
    }),
    // check("rol", "No es un rol valido").isIn(["ADMIN_ROLE", "USER_ROLE"]),
    check("rol").custom(esRoleValido),
    validarCampos,
  ],
  usuarioPost
);
router.delete(
  "/:id",
  [
    validarJWT,
    // esAdminRole,
    tieneRole("ADMIN_ROLE", "NOSE_ROLE"),
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(existeUsuarioPorId),
    validarCampos,
  ],
  usuarioDelete
);
router.patch("/", usuarioPatch);

module.exports = router;
