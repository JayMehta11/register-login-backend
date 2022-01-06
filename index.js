const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config()

app.use(cors());
app.use(express.json());
app.use(express.urlencoded());

require('./Model');
app.use('/api',require('./api'));

app.use(express.static(__dirname+'/view'));
const PORT = process.env.PORT || 5000;
app.listen(PORT,() => {
    console.log("Server started");
});