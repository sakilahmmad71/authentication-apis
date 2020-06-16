const validator = require('validator');
const isEmpty = require('./isempty');

const validLoginInput = (data) => {
    const errors = {};

    if (!data.email) {
        errors.email = 'Email field is required.';
    } else if (!validator.isEmail(data.email)) {
        errors.email = 'Not a valid email.';
    }

    if (!data.password) {
        errors.password = 'Password fields is required.';
    }

    return {
        errors,
        isValid: isEmpty(errors),
    };
};

module.exports = validLoginInput;
