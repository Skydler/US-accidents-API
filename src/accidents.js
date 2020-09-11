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
    const radiusToKm = radius * 1000;
    const coords = [parseFloat(longitude), parseFloat(latitude)]

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
        const limit = 5;
    const weatherQuery = [{ $sortByCount: "$Weather_Condition" }, { $limit: limit }, { $project: { _id: false, weather: '$_id', count: true } }]
    const visibilityQuery = [{ $sortByCount: "$Visibility(mi)" }, { $limit: limit }, { $project: { _id: false, "visibility(mi)": '$_id', count: true } }]
    const tempQuery = [{ $sortByCount: "$Temperature(F)" }, { $limit: limit }, { $project: { _id: false, "temperature(F)": '$_id', count: true } }]
    const windQuery = [{ $sortByCount: "$Wind_Direction" }, { $limit: limit }, { $project: { _id: false, windDirection: '$_id', count: true } }]

    Promise.all([
        connection.Accidents.aggregate(weatherQuery).exec(),
        connection.Accidents.aggregate(tempQuery).exec(),
        connection.Accidents.aggregate(visibilityQuery).exec(),
        connection.Accidents.aggregate(windQuery).exec(),
    ]).then(values => callback(parser.parseWeatherConditions(values)));
}

function findMostCommonLocationConditions(callback) {
    const limit = 5;
    const timeQuery = [{ $sortByCount: "$Start_Time" }, { $limit: limit }, { $project: { _id: false, time: '$_id', count: true } }]
    const cityQuery = [{ $sortByCount: "$City" }, { $limit: limit }, { $project: { _id: false, city: '$_id', count: true } }]
    const stateQuery = [{ $sortByCount: "$State" }, { $limit: limit }, { $project: { _id: false, state: '$_id', count: true } }]

    Promise.all([
        connection.Accidents.aggregate(timeQuery).allowDiskUse(true).exec(),
        connection.Accidents.aggregate(cityQuery).exec(),
        connection.Accidents.aggregate(stateQuery).exec(),
    ]).then(values => callback(parser.parseLocationConditions(values)));
}

function findMostCommonTerrainConditions(callback) {
    const limit = 5; //It's all booleans so it's kind of the same here, but I will leave it just in case
    const crossingQuery = [{ $sortByCount: "$Crossing" }, { $limit: limit }, { $project: { _id: false, crossing: '$_id', count: true } }]
    const giveAwayQuery = [{ $sortByCount: "$Give_Way" }, { $limit: limit }, { $project: { _id: false, giveAway: '$_id', count: true } }]
    const junctionQuery = [{ $sortByCount: "$Junction" }, { $limit: limit }, { $project: { _id: false, junction: '$_id', count: true } }]
    const noExitQuery = [{ $sortByCount: "$No_Exit" }, { $limit: limit }, { $project: { _id: false, noExit: '$_id', count: true } }]
    const railWayQuery = [{ $sortByCount: "$Railway" }, { $limit: limit }, { $project: { _id: false, railWay: '$_id', count: true } }]
    const stopQuery = [{ $sortByCount: "$Stop" }, { $limit: limit }, { $project: { _id: false, stop: '$_id', count: true } }]
    const turningLoopQuery = [{ $sortByCount: "$Turning_Loop" }, { $limit: limit }, { $project: { _id: false, turningLoop: '$_id', count: true } }]
    const stationQuery = [{ $sortByCount: "$Station" }, { $limit: limit }, { $project: { _id: false, station: '$_id', count: true } }]

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

module.exports = {
    findBetweenDates,
    findAccidentsWithin,
    findMostDangerousPointsWithin,
    findAverageDistance,
    findMostCommonLocationConditions,
    findMostCommonWeatherConditions,
    findMostCommonTerrainConditions,
};
