const express = require("express");
const app = express();
const apiRouter = require('./src/api');

require('dotenv').config();
const API_PORT = process.env.API_PORT || 3000;

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.listen(API_PORT, () => {
    console.log(`Server initializating on port ${API_PORT}`);
});

app.use('/', apiRouter);
