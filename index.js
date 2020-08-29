const express = require("express");
const app = express();
require('dotenv').config();
const apiRouter = require('./api');

const API_PORT = process.env.API_PORT || 3000;

app.listen(API_PORT, () => {
    console.log(`Server initializating on port ${API_PORT}`);
});

app.use('/', apiRouter);
