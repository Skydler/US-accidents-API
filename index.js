const express = require("express");
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const app = express();
const mongoUrl = 'mongodb://localhost:27017/accidents';
const dbName = 'accidents';
const client = new MongoClient(mongoUrl);

app.listen(3000, () => {
    console.log("Server initializating on port 3000");
});

app.get('/insert', (request, response) => {
    makeConnection(insertDocuments);
    response.send({
        pepe: "hola",
        edad: 20,
    });
});


function makeConnection(callback) {
    client.connect((err) => {
        if (err) {
            throw err;
        }

        const db = client.db(dbName);
        callback(db, function () {
            client.close();
        });
    })

}

function insertDocuments(db, callback) {
    // Get the documents collection
    const collection = db.collection('documents');
    // Insert some documents
    collection.insertMany([
        { a: 1 }, { a: 2 }, { a: 3 }
    ], function (err, result) {
        assert.equal(err, null);
        assert.equal(3, result.result.n);
        assert.equal(3, result.ops.length);
        console.log("Inserted 3 documents into the collection");
        callback(result);
    });
}
