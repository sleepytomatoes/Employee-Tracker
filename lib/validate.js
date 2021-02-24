const joi = require("joi"); //validating npm library

function validateNumber(name) {
    let schema = joi.number().required();
    return joi.validate(name, schema, onValidation);
}

function onValidation(err, val) {
    if (err) {
        return err.message;
    }
    else {
        return true;
    }
}

function validateString(name) {
    var schema = joi.string().required();
    return joi.validate(name, schema, onValidation);
}


module.exports = {
    validateNumber: validateNumber,
    onValidation: onValidation,
    validateString: validateString
};