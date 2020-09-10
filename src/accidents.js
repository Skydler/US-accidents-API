const connection = require('./connection.js');

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
    const aggregation = [
        {
            "$geoNear": {
                "near": {
                    "type": "Point",
                    "coordinates": [longitude, latitude]
                },
                "distanceField": "distanceToCenter",
                "maxDistance": radius * 1000,
                "key": "Start_Loc_2dsphere",
            }
        },
        {
            "$sortByCount": "$Start_Loc.coordinates"
        },
        {
            "$limit": 5
        }
    ];

    connection.Accidents.aggregate(aggregation, (err, res) => {
        if (err) { throw err }
        callback(res);
    });
}

function findMostCommonWeatherConditions(callback) {
    const limit = 5;
    const weatherQuery = [{ $sortByCount: "$Weather_Condition" }, { $limit: limit }]
    const visibilityQuery = [{ $sortByCount: "$Visibility(mi)" }, { $limit: limit }]
    const tempQuery = [{ $sortByCount: "$Temperature(F)" }, { $limit: limit }]
    const windQuery = [{ $sortByCount: "$Wind_Direction" }, { $limit: limit }]

    Promise.all([
        connection.Accidents.aggregate(weatherQuery).exec(),
        connection.Accidents.aggregate(tempQuery).exec(),
        connection.Accidents.aggregate(visibilityQuery).exec(),
        connection.Accidents.aggregate(windQuery).exec(),
    ]).then(values => callback(values))
}

module.exports = {
    findBetweenDates,
    findAccidentsWithin,
    findMostDangerousPointsWithin,
    findAverageDistance,
    findMostCommonWeatherConditions,
};
