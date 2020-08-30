const express = require("express");
const app = express();
const apiRouter = require('./api');

require('dotenv').config();
const API_PORT = process.env.API_PORT || 3000;

app.listen(API_PORT, () => {
    console.log(`Server initializating on port ${API_PORT}`);
});

app.use('/', apiRouter);
