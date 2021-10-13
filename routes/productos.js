const { Router } = require("express");
const { check } = require("express-validator");

const {
  crearProducto,
  obtenerProductos,
  obtenerProducto,
  actualizarProducto,
  borrarProducto,
} = require("../controllers/productos");

const {
  existeCategoriaPorId,
  existeProductoPorId,
  esRoleValido,
} = require("../helpers/db.validators");

const { tieneRole, validarCampos, validarJWT } = require("../middlewares");

const router = Router();

//obtenerProductos -publico
router.get("/", obtenerProductos);

//obtenerProducto  - publico
router.get(
  "/:id",
  [
    check("id", "No es un ID valido").isMongoId(),
    check("id").custom(existeProductoPorId),
    validarCampos,
  ],
  obtenerProducto
);

//crearProducto
router.post(
  "/",
  [
    validarJWT,
    check("nombre", "El nombre es requerido").notEmpty(),
    check("categoria", "La categoria es obligatoria").notEmpty(),
    check("categoria", "El id de la categoria es invalido").isMongoId(),
    check("categoria").custom(existeCategoriaPorId),
    validarCampos,
  ],
  crearProducto
);

//actualizarProducto
router.put(
  "/:id",
  [
    validarJWT,
    check("id", "No es un ID valido").isMongoId(),
    check("id").custom(existeProductoPorId),
    check("nombre", "El nombre es requerido").notEmpty(),
    check("categoria", "La categoria es obligatoria").notEmpty(),
    check("categoria", "El id de la categoria es invalido").isMongoId(),
    check("categoria").custom(existeCategoriaPorId),
    validarCampos,
  ],
  actualizarProducto
);

//borrarProducto
router.delete(
  "/:id",
  [
    validarJWT,
    check("id", "El id no es valido").isMongoId(),
    check("id").custom(existeProductoPorId),
    tieneRole("ADMIN_ROLE"),
    validarCampos,
  ],
  borrarProducto
);

module.exports = router;
