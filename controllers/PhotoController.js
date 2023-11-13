const Photo = require("../models/Photo")
// Para fazer as operações do banco de dados
const mongoose = require("mongoose");
const User = require("../models/User");
const fs = require('fs');
const path = require('path');

// Criação das funções de fotos: Inserção, Atualização, Exclusão.

// Insert a photo, with an user related to it
// função assíncrona vamos trabalhar com requisição e resposta
const insertPhoto = async (req, res) => {

    const { title } = req.body
    const image = req.file.filename;

    // Vai pegar a requisição do usuário
    const reqUser = req.user;

    // Buscar o usuário pelo ID pela requisição
    const user = await User.findById(reqUser._id);

    // Create a photo
    const newPhoto = await Photo.create({
        image,
        title,
        userId: user._id,
        userName: user.name,
    });

    // If photo was created successfully, return data
    if (!newPhoto) {
        res.status(422).json({
            errors: ["Houve um problema, por favor tente novamente mais tarde"]
        });
        return;
    }

    res.status(201).json(newPhoto);
}

// Remove a photo from DB and physical directory
const deletePhoto = async (req, res) => {
    const { id } = req.params

    const reqUser = req.user

    try {
        const photo = await Photo.findById(new mongoose.Types.ObjectId(id))

        // Check if photo exists
        if (!photo) {
            res.status(404).json({ errors: ["Foto não encontrada!"] })
            return;
        }

        // Check if photo belongs to the user (verifica se a foto pertence ao usuário)
        if (!photo.userId.equals(reqUser.id)) {
            res
                .status(422)
                .json({
                    errors: ["Ocorreu um erro, por favor tente novamente mais tarde."],
                })
            return;
        }

        // Constrói o caminho para a foto no diretório de photos
        const photoPath = path.join(__dirname, '../uploads/photos', photo.image);


        // MOVE A PHOTO PARA A PASTA EXPURGO EM VEZ DE EXCLUÍ-LA PERMANENTEMENTE
        // Construct the path to the "expurgo" directory
        const expurgoPath = path.join(__dirname, '../uploads/expurgo');

        // Check if the "expurgo" directory exists; if not, create it
        if (!fs.existsSync(expurgoPath)) {
            fs.mkdirSync(expurgoPath);
        }

        // Construct the new path for the photo in the "expurgo" directory
        const expurgoPhotoPath = path.join(expurgoPath, photo.image);

        // Move the photo to the "expurgo" directory
        fs.renameSync(photoPath, expurgoPhotoPath);

        // CRIAR A FUNÇÃO QUE VAI MOVER OS DADOS DA PHOTO PARA A TABELA Photo_Expurgo do DATABASE 


        // Remove the photo from the database
        await Photo.findByIdAndDelete(photo._id);

        
        // Exclui a foto DEFINITIVAMENTE do diretório do diretório de fotos
        // // Check if the file exists before attempting to delete it
        // if (fs.existsSync(photoPath)) {
        //     // Remove the photo from the physical directory
        //     fs.unlinkSync(photoPath);
        // }

        res
            .status(200)
            .json({ id: photo._id, message: "Foto excluída com sucesso." });

    } catch (error) {
        res.status(404).json({ errors: ["Foto não encontrada!"] })
        return;

    }

};

module.exports = {
    insertPhoto,
    deletePhoto,
}

