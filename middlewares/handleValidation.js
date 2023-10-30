const { validationResult } = require("express-validator")

// 
const validate = (req, res, next ) => {

    const errors = validationResult(req)

    // Se não tem erro, então continua
    if (errors.isEmpty()) {
        return next()
    }
    // Mas se encontrar erros:
    const extractedErrors = []

    errors.array().map((err) => extractedErrors.push(err.msg))

    return res.status(422).json({
        errors: extractedErrors
    });

};

module.exports = validate;