const express = require("express");
const accidents = require('./accidents');
const router = express.Router();

//Receives two dates and retrieves all the accidents that happened between them
router.get('/between', (req, res) => {
    const start = req.query.startDate;
    const end = req.query.endDate;
    if (!start || !end) res.sendStatus(404);
    else {
        accidents.findBetweenDates(start, end, (results) => {
            res.send(results);
        });
    }
});

//Retrieves the accidents' most common conditions (temperature, time, etc.).
router.get('/mostCommonConditions', (req, res) => {
    res.send({
        tarea: "determinar las condiciones más comunes en los accidentes (hora del día, condiciones climáticas, etc)"
    });
});

//Receives a geoPoint (latitude and longitude) and a radius (in km) and retrieves all the accidentes in that area.
router.get('/accidentsWithin', (req, res) => {
    const longitude = req.query.longitude;
    const latitude = req.query.latitude;
    const radius = req.query.radius;
    if (!longitude || !latitude || !radius) {
        res.sendStatus(404);
    } else {
        accidents.findAccidentsWithin({ longitude, latitude }, radius, (results) => {
            res.send(results);
        });
    }
});

//Receives a geoPoint (latitude and longitude) and a radius (in km) and retrieves the most dangerous points in that area.
router.get('/mostDangerousPoints', (req, res) => {
    const longitude = req.query.longitude;
    const latitude = req.query.latitude;
    const radius = req.query.radius;
    if (!longitude || !latitude || !radius) {
        res.sendStatus(404);
    } else {
        accidents.findMostDangerousPointsWithin({ longitude, latitude }, radius, (results) => {
            res.send(results);
        });
    }
});

router.get('/averageDistance', (req, res) => {
    // "obtener la distancia promedio desde el inicio al fin del accidente"
    accidents.findAverageDistance((results) => {
        res.send(results);
    })
});

module.exports = router;
