const Photo = require("../models/Photo")
// Para fazer as operações do banco de dados
const mongoose = require("mongoose");
const User = require("../models/User");

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

// Remove a photo from DB
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

        // Check photo belongs to user (verifica se a foto pertence ao usuário)
        if (!photo.userId.equals(reqUser.id)) {
            res
                .status(422)
                .json({
                    errors: ["Ocorreu um erro, por favor tente novamente mais tarde."],
                })
        }

        await Photo.findByIdAndDelete(photo._id);

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

