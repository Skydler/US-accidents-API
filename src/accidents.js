const connection = require('./connection.js');
const parser = require('./parser.js');

function findBetweenDates(startDate, endDate, callback) {
    const query = {
        $and: [
            { Start_Time: { $gte: startDate } },
            { End_Time: { $lte: endDate } }
        ]
    }
    connection.Accidents.find(query, (err, res) => {
        if (err) { throw err }
        callback(res)
    });
}

function findAverageDistance(callback) {
    const aggregation = [
        {
            $group: {
                _id: null, average: { $avg: '$Distance(mi)' }
            }
        },
        {
            $project: {
                _id: 0,
                average: 1
            }
        }
    ];
    connection.Accidents.aggregate(aggregation, (err, res) => {
        if (err) { throw err }
        callback(res);
    })
}

function findAccidentsWithin({ longitude, latitude }, radius, callback) {
    let query = {
        Start_Loc: {
            $near: {
                $geometry: { type: "Point", coordinates: [longitude, latitude] },
                $maxDistance: radius * 1000
            }
        }
    };
    connection.Accidents.find(query, (err, res) => {
        if (err) { throw err }
        query = {
            End_Loc: {
                $near: {
                    $geometry: { type: "Point", coordinates: [longitude, latitude] },
                    $maxDistance: radius * 1000
                }
            }
        };
        const nearStartPointAccidents = res;
        connection.Accidents.find(query, (err, res) => {
            if (err) { throw err }
            callback(Object.assign(res, nearStartPointAccidents));
        });
    });
}

function findMostDangerousPointsWithin({ longitude, latitude }, radius, callback) {
    const coords = [parseFloat(longitude), parseFloat(latitude)]
    const radiusToKm = radius * 1000;

    connection.Accidents.aggregate()
        .near({
            near: { type: "Point", coordinates: coords },
            distanceField: "distanceToCenter",
            maxDistance: radiusToKm,
            key: "Start_Loc"
        })
        .sortByCount("Start_Loc.coordinates")
        .limit(5)
        .exec((err, res) => {
            if (err) { throw err }
            callback(res);
        });
}

function findMostCommonWeatherConditions(callback) {
    const weatherQuery = constructCommonQuery("Weather_Condition");
    const visibilityQuery = constructCommonQuery("Visibility");
    const tempQuery = constructCommonQuery("Temperature");
    const windQuery = constructCommonQuery("Wind_Direction");

    Promise.all([
        connection.Accidents.aggregate(weatherQuery).exec(),
        connection.Accidents.aggregate(tempQuery).exec(),
        connection.Accidents.aggregate(visibilityQuery).exec(),
        connection.Accidents.aggregate(windQuery).exec(),
    ]).then(values => callback(parser.parseWeatherConditions(values)));
}

function findMostCommonLocationConditions(callback) {
    const timeQuery = constructCommonQuery("Start_Time");
    const cityQuery = constructCommonQuery("City");
    const stateQuery = constructCommonQuery("State");

    Promise.all([
        connection.Accidents.aggregate(timeQuery).allowDiskUse(true).exec(),
        connection.Accidents.aggregate(cityQuery).exec(),
        connection.Accidents.aggregate(stateQuery).exec(),
    ]).then(values => callback(parser.parseLocationConditions(values)));
}

function findMostCommonTerrainConditions(callback) {
    const crossingQuery = constructCommonQuery("Crossing");
    const giveAwayQuery = constructCommonQuery("Give_Way");
    const junctionQuery = constructCommonQuery("Junction");
    const noExitQuery = constructCommonQuery("No_Exit");
    const railWayQuery = constructCommonQuery("Railway");
    const stopQuery = constructCommonQuery("Stop");
    const turningLoopQuery = constructCommonQuery("Turning_Loop");
    const stationQuery = constructCommonQuery("Station");

    Promise.all([
        connection.Accidents.aggregate(crossingQuery).exec(),
        connection.Accidents.aggregate(giveAwayQuery).exec(),
        connection.Accidents.aggregate(junctionQuery).exec(),
        connection.Accidents.aggregate(noExitQuery).exec(),
        connection.Accidents.aggregate(railWayQuery).exec(),
        connection.Accidents.aggregate(stopQuery).exec(),
        connection.Accidents.aggregate(turningLoopQuery).exec(),
        connection.Accidents.aggregate(stationQuery).exec(),
    ]).then(values => callback(parser.parseTerrainConditions(values)));
}

function constructCommonQuery(field, limit = 5) {
    return [
        { $sortByCount: `$${field}` },
        { $match: { _id: { $ne: "" } } },
        { $limit: limit },
        { $project: { _id: false, value: '$_id', count: true } }
    ]
}

module.exports = {
    findBetweenDates,
    findAccidentsWithin,
    findMostDangerousPointsWithin,
    findAverageDistance,
    findMostCommonLocationConditions,
    findMostCommonWeatherConditions,
    findMostCommonTerrainConditions,
};
