const router = require('express').Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const JWT = require('jsonwebtoken');

const User = require('../../models/User');
const { secretOrKey } = require('../../configs/app.config');
const validateRegisterInput = require('../../validations/register');
const validateLoginInput = require('../../validations/login');

// @route   api/v1/users/register
// @desc    users can register through this route
// @access  public
router.post('/register', (req, res) => {
    const { name, email, password } = req.body;

    // Firstly checking the input fields error
    const { errors, isValid } = validateRegisterInput(req.body);
    if (!isValid) res.status(400).json(errors);

    User.findOne({ email }).then((user) => {
        if (user) {
            errors.user = 'User already exist.';
            return res.status(400).json(errors);
        }

        const avatar = gravatar.url(email, { s: '200', r: 'pg', d: 'mm' });
        const newUser = new User({ name, email, password, avatar });

        bcrypt.hash(password, 8, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
                .save()
                .then((user) => res.status(201).json(user))
                .catch((err) => res.status(500).json(err));
        });
    });
});

// @route   api/v1/users/login
// @desc    users can login through this route
// @access  public
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Fristly validate the input fields errors
    const { errors, isValid } = validateLoginInput(req.body);
    if (!isValid) res.status(400).json(errors);

    User.findOne({ email }).then((user) => {
        if (!user) {
            errors.user = `User doesn't exist.`;
            return res.status(404).json(errors);
        }

        bcrypt.compare(password, user.password).then((matched) => {
            if (!matched) {
                errors.password = `Password doesn't matched.`;
                return res.status(400).json(errors);
            }

            const payload = { id: user.id, name: user.name, avatar: user.avatar };
            JWT.sign(payload, secretOrKey, { expiresIn: '2h' }, (err, token) => {
                if (err) throw err;
                return res
                    .status(200)
                    .json({ massage: 'Login successfull', token: `Bearer ${token}` });
            });
        });
    });
});

module.exports = router;
