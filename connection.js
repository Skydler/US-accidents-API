require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URL + process.env.MONGO_DB, { useNewUrlParser: true })

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () { console.log("Connected!!"); });


// Schema declaration
const accident_schema = mongoose.Schema({});
const Accidents = mongoose.model('accident', accident_schema);

module.exports = { Accidents };
