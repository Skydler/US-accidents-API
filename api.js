const express = require("express");
const accidents = require('./accidents');
const router = express.Router();

router.get('/:startTime/:endTime', (req, res) => {
    accidents.insertDocuments();
    res.send({
        tarea: "devolver todos los accidentes ocurridos entre 2 fechas dadas"
    });
});

router.get('/mostCommonConditions', (req, res) => {
    accidents.insertDocuments();
    res.send({
        tarea: "determinar las condiciones más comunes en los accidentes (hora del día, condiciones climáticas, etc)"
    });
});

router.get('/accidentsWithin/:geoPoint/:radius', (req, res) => {
    accidents.insertDocuments();
    res.send({
        tarea: "dado un punto geográfico y un radio (expresado en kilómetros) devolver todos los accidentes ocurridos dentro del radio."
    });
});

router.get('/mostDangerousPoints', (req, res) => {
    accidents.insertDocuments();
    res.send({
        tarea: "devolver los 5 puntos más peligrosos (definiendo un determinado radio)"
    });
});

router.get('/:id/averageActionDistance', (req, res) => {
    accidents.insertDocuments();
    res.send({
        tarea: "obtener la distancia promedio desde el inicio al fin del accidente"
    });
});

module.exports = router;