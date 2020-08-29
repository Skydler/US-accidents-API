const connection = require('./connection.js');

const ACCIDENTS_COLLECTION = 'accidents';

function insertDocuments() {
    connection.makeConnection((db, callback) => {
        const collection = db.collection(ACCIDENTS_COLLECTION);
        collection.insertMany([
            { a: 1 }, { a: 2 }, { a: 3 }
        ], function (err, result) {
            callback(result);
        });
    });
}

module.exports = {insertDocuments};