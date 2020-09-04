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
        // {
        //     $match: { 'Distance(mi)': { $gte: 0.01 } }    //Use this to only match accidents with some distance
        // },
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
        callback(res)
    })
}

function findAccidentsWithin({longitude, latitude}, radius, callback) {
    let query = {
        Start_Loc: {
            $near: {
                $geometry: { type: "Point",  coordinates: [ longitude, latitude ] },
                $maxDistance: radius * 1000
            }
        }
    };
    connection.Accidents.find(query, (err, res) => {
        if (err) { throw err }
        query = {
            End_Loc: {
                $near: {
                    $geometry: { type: "Point",  coordinates: [ longitude, latitude ] },
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

function findMostDangerousPointsWithin({longitude, latitude}, radius, callback) {
    const aggregation = [
        {
            $geoNear: {
                near: {
                    type: "Point",
                    coordinates: [longitude, latitude]
                },
                distanceField: "???",
                maxDistance: radius * 1000,
                key: "Start_Loc"
            }
        },
        {
            $sortByCount: "$Start_Loc.coordinates"
        },
        {
            $limit: 5
        }
    ];
    connection.Accidents.aggregate(aggregation, (err, res) => {
        if (err) { throw err }
        callback(Object.assign(res, nearStartPointAccidents));
    });
}

module.exports = {
    findBetweenDates,
    findAccidentsWithin,
    findMostDangerousPointsWithin,
    findAverageDistance
};
