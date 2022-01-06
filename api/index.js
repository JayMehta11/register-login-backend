const express = require('express');
const app = express.Router();

app.use('/auth',require('./auth.api'));

module.exports = app