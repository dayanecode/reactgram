const express = require("express")
const router = express.Router()

// Controller
const { insertPhoto, deletePhoto } = require("../controllers/PhotoController")

// Middlewares
const { photoInsertValidation } = require("../middlewares/photoValidation")
const authGuard = require("../middlewares/authGuard")
const validate = require("../middlewares/handleValidation")
const { imageUpload } = require("../middlewares/imageUpload");

// Routes
// Precisa estar autenticado, adicionar uma imagem só, validate para imprimir os erros pra gente:
router.post("/",
    authGuard,
    imageUpload.single("image"),
    photoInsertValidation(),
    validate,
    insertPhoto
);

router.delete("/:id", authGuard, deletePhoto)

module.exports = router;
