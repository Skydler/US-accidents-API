const connection = require('./connection.js');

function searchBetweenDates(startDate, endDate, callback) {
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

module.exports = { searchBetweenDates, findAverageDistance };
