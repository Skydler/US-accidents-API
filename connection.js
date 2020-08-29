require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const MONGO_URL = process.env.MONGO_URL + process.env.MONGO_DB;
const client = new MongoClient(MONGO_URL);

function makeConnection(callback) {
    client.connect((err) => {
        if (err) {
            throw err;
        }
        const db = client.db();
        callback(db, function () {
            client.close();
        });
    })

}

module.exports = {makeConnection};