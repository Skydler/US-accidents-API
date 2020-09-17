const express = require("express");
const accidents = require('./accidents');
const router = express.Router();

//Receives two dates and retrieves all the accidents that happened between them
router.get('/between', (req, res) => {
    const start = req.query.startDate;
    const end = req.query.endDate;
    const limit = req.query.limit;
    if (!start || !end) {
        res.sendStatus(404);
    }
    else {
        accidents.findBetweenDates(start, end, results => res.send(results), limit);
    }
});

//Receives a geoPoint (latitude and longitude) and a radius (in km) and retrieves all the accidentes in that area.
router.get('/accidentsWithin', (req, res) => {
    const longitude = req.query.longitude;
    const latitude = req.query.latitude;
    const radius = req.query.radius;
    const limit = req.query.limit;
    if (!longitude || !latitude || !radius) {
        res.sendStatus(404);
    } else {
        accidents.findAccidentsWithin({ longitude, latitude }, radius, results => res.send(results), limit);
    }
});

//Receives a geoPoint (latitude and longitude) and a radius (in km) and retrieves the most dangerous points in that area.
router.get('/mostDangerousPoints', (req, res) => {
    const longitude = req.query.longitude;
    const latitude = req.query.latitude;
    const radius = req.query.radius;
    const limit = req.query.limit;
    if (!longitude || !latitude || !radius) {
        res.sendStatus(404);
    } else {
        accidents.findMostDangerousPointsWithin({ longitude, latitude }, radius, results => res.send(results), limit);
    }
});

// Retrieves the average distance of accidents
router.get('/averageDistance', (req, res) => {
    accidents.findAverageDistance(results => res.send(results))
});

//Retrieves accidents most common conditions (temperature, time, etc.).
router.get('/mostCommonConditions/weather', (req, res) => {
    accidents.findMostCommonWeatherConditions(results => res.send(results))
});

router.get('/mostCommonConditions/location', (req, res) => {
    accidents.findMostCommonLocationConditions(results => res.send(results))
});

router.get('/mostCommonConditions/terrain', (req, res) => {
    accidents.findMostCommonTerrainConditions(results => res.send(results))
});


module.exports = router;
