const { Router } = require("express");
const { check } = require("express-validator");

const { existeCategoriaPorId } = require("../helpers/db.validators");

const {
  crearCategoria,
  obtenerCategorias,
  obtenerCatgoria,
  actualizarCategoria,
  borrarCategoria,
} = require("../controllers/categorias");

const { validarCampos, validarJWT, tieneRole } = require("../middlewares");

const router = Router();

//Obtner las categorias - publico
router.get("/", obtenerCategorias);

//Obtener una categoria por id - publico
router.get(
  "/:id",
  [
    check("id", "No es un ID valido").isMongoId(),
    check("id").custom(existeCategoriaPorId),
    validarCampos,
  ],
  obtenerCatgoria
);

//Crear categoria - privado - cualquier persona con token valido
router.post(
  "/",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  crearCategoria
);

//Actualizar -privado -cualquiera con token válido
router.put(
  "/:id",
  [
    check("id", "No es un ID valido").isMongoId(),
    check("id").custom(existeCategoriaPorId),
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  actualizarCategoria
);

//Borrar categoria - Admin
router.delete(
  "/:id",
  [
    validarJWT,
    check("id", "No es un ID valido").isMongoId(),
    check("id").custom(existeCategoriaPorId),
    tieneRole("ADMIN_ROLE"),
    validarJWT,

    validarCampos,
  ],
  borrarCategoria
);

module.exports = router;
