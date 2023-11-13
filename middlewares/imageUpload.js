const multer = require("multer")
const path = require("path")
const fs = require('fs')

// Destination to store image
const imageStorage = multer.diskStorage({
    destination: (req, file, cb) => {

        let uploadsFolder = path.join(__dirname, "../uploads");

        // garante que a pasta 'uploads' exista!
        if (!fs.existsSync(uploadsFolder)) {
            fs.mkdirSync(uploadsFolder)
        }

        // Verifica se a base URL inclui users and photos
        if (req.baseUrl.includes("users")) {
            let folderUser = path.join(__dirname, '../uploads/users');
            if (!fs.existsSync(folderUser)) {
                fs.mkdirSync(folderUser);
            }
            cb(null, `${folderUser}`);
            
        } else if (req.baseUrl.includes("photos")) {
            let folderPhotos = path.join(__dirname, '../uploads/photos');
            if (!fs.existsSync(folderPhotos)) {
                fs.mkdirSync(folderPhotos);
            }
            cb(null, `${folderPhotos}`);

        } else {
            cb(new Error("Não foi possível determinar o diretório de destino!"));
        }
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

// Mini validação da imagem
const imageUpload = multer({
    storage: imageStorage,

    // função callback que verifica a extensão do arquivo
    fileFilter(req, file, cb) {

        if (!file.originalname.match(/\.(png|jpg)$/)) {

            // upload only png and jpg formats
            return cb(new Error("Por favor, envie apenas arquivo png ou jpg!"));
        }
        cb(undefined, true);
    },
})

module.exports = { imageUpload };
