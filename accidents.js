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

module.exports = { searchBetweenDates };
