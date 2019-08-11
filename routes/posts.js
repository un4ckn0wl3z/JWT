const router = require('express').Router();
const verify = require('./verifyToken');

router.get('/', verify, (req, res) => {
    console.log(req.user);
    res.json({ posts: { title: 'Scret post.', description: 'No one access this.' } });
});

module.exports = router;