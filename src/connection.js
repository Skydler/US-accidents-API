require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URL + process.env.MONGO_DB, { useUnifiedTopology: true, useNewUrlParser: true })

// Schema declaration
const accident_schema = mongoose.Schema({});
const Accidents = mongoose.model('accident', accident_schema);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.info("Connected!!");
});

process.on('SIGINT', function () {
    mongoose.disconnect(function () {
        console.log('Mongoose disconnected on app termination');
        process.exit(0);
    });
});


module.exports = { Accidents };
