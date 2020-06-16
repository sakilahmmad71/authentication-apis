const validator = require('validator');
const isEmpty = require('./isempty');

const registerFormValidation = (data) => {
    const errors = {};

    if (!data.name) {
        errors.name = 'Name field is required.';
    } else if (!validator.isLength(data.name, { min: 3, max: 40 })) {
        errors.name = 'Name should be between 2 to 40 charecters atleast.';
    }

    if (!data.email) {
        errors.email = 'Email field is required.';
    } else if (!validator.isEmail(data.email)) {
        errors.email = 'Not a valid email.';
    }

    if (!data.password) {
        errors.password = 'Password field is required.';
    } else if (!validator.isLength(data.password, { min: 6 })) {
        errors.password = 'Password should be atleast 6 charecter long.';
    }

    return {
        errors,
        isValid: isEmpty(errors),
    };
};

module.exports = registerFormValidation;
