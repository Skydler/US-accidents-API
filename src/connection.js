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

// db.accidents.update(
//     {},
//     [
//         {
//             $set: {
//                 Start_Loc: {
//                     type: 'Point',
//                     coordinates: ['$Start_Lng', '$Start_Lat']
//                 },
//                 End_Loc: {
//                     type: 'Point',
//                     coordinates: {
//                         $cond: [
//                             {
//                                 $eq: ["$End_Lng", ""]
//                             },
//                             ['$Start_Lng', '$Start_Lat'],
//                             ['$End_Lng', '$End_Lat']
//                         ]
//                     }
//                 }
//             }
//         }
//     ],
//     {
//         multi: true
//     }
// );

// db.accidents.createIndex({ Start_Loc: "2dsphere" });
// db.accidents.createIndex({ End_Loc: "2dsphere" });

module.exports = { Accidents };
