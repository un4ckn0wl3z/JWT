const router = require('express').Router();
const User = require('../model/User');
const {registerValidation,  } = require('../validation');

router.post('/register', async (req, res) => {

    /** LET'S VALIDATE */
    const {error} = registerValidation(req.body);
    if (error) return res.status(400).send({error:error.details[0].message});

    /** checking */
    const emailExist = await User.findOne({
        email: req.body.email
    });

    if(emailExist) return res.status(400).send({error:'email already exits.'});
    


    /** create a new user */
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
    });

    try {
        const savedUser = await user.save();
        res.send(savedUser);
    } catch (error) {
        res.status(400).send(error);
    }
});


module.exports = router;