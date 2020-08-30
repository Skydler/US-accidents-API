const express = require("express");
const accidents = require('./accidents');

const router = express.Router();

router.get('/between', (req, res) => {
    const start = req.query.start;
    const end = req.query.end;
    accidents.searchBetweenDates(start, end, (results) => {
        res.send(results);
    });
});

module.exports = router;
