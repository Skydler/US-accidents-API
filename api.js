const express = require("express");
const accidents = require('./accidents');

const router = express.Router();

router.get('/insert', (req, res) => {
    accidents.insertDocuments();
    res.send({
        pepe: "hola",
        edad: 20,
    });
});

module.exports = router;