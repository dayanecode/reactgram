const express = require("express");
const router = express();

router.use("/api/users", require("./UserRoutes"))
// Habilitando as rotas de fotos na chamada da API 
router.use("/api/photos", require("./PhotoRoutes"))

// test route
router.get("/", (req, res) => {
    res.send("API Working!")
});

module.exports = router