const router = require('express').Router();
const User = require('../model/User');
const { registerValidation, loginValidation } = require('../validation');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');



/** register */
router.post('/register', async (req, res) => {

    /** LET'S VALIDATE */
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).send({ error: error.details[0].message });

    /** checking duplidate user */
    const emailExist = await User.findOne({
        email: req.body.email
    });

    if (emailExist) return res.status(400).send({ error: 'email already exits.' });

    /** hashing password */
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    /** create a new user */
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
    });

    try {
        const savedUser = await user.save();
        res.send({ user: savedUser._id });
    } catch (error) {
        res.status(400).send(error);
    }
});

/** login */
router.post('/login', async (req, res) => {
    /** LET'S VALIDATE */
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send({ error: error.details[0].message });

    /** checking user */
    const user = await User.findOne({
        email: req.body.email
    });
    if (!user) return res.status(400).send({ error: 'Email is not found.' });

    /** check password */
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) res.status(400).send({ error: 'Invalid password.' });

    /** create and assign a token */

    const token = await jwt.sign({ _id: user.id }, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send({ token: token });
    //res.send({ message: 'Logged in!' });


});

module.exports = router;