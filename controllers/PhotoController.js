const Photo = require("../models/Photo")

const mongoose = require("mongoose")

// Insert a photo, with an user related to it

const insertPhoto = async(req, res) => {

    const {title} = req.body
    const image = req.file.filename;

    const 

    console.log(req.body);

    res.send("Photo insert")
}

module.exports = {
    insertPhoto,
}

