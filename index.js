const express = require('express');
const app = express();
const mongoose = require('mongoose');

/** connect to db */
mongoose.connect('mongodb://localhost:27017/myapp', { useNewUrlParser: true } , () => {
    console.log('Connected to db!');
});

/** import routes */
const authRoute = require('./routes/auth');

/** route middleware */
app.use('/api/user', authRoute);

/** binding */
app.listen(3000,() => {
    console.log('Server Up and Running...');
});
