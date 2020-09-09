const accidents = require('../src/accidents.js')
const mongoose = require('mongoose');

afterAll(() => {
    mongoose.connection.close();
});

test('should return an array of accidents between 2 dates', done => {
    const expected_data_length = 22;

    function callback(data) {
        try {
            expect(data.length).toBe(expected_data_length);
            done();
        } catch (error) {
            done(error);
        }
    }

    const startDate = '2016-02-08 05:46:00';
    const endDate = '2016-02-08 11:00:00';

    accidents.findBetweenDates(startDate, endDate, callback);
});

test('should return the average distance of accidents', done => {
    const expected_data = [{ "average": 0.28556535694629914 }];

    function callback(data) {
        try {
            expect(data).toStrictEqual(expected_data);
            done();
        } catch (error) {
            done(error);
        }
    }
    accidents.findAverageDistance(callback)
});

test('should return all accidents within a given point and radius', done => {
    const expected_data_length = 2;

    function callback(data) {
        try {
            expect(data.length).toStrictEqual(expected_data_length);
            done();
        } catch (error) {
            done(error);
        }
    }
    accidents.findAccidentsWithin({ longitude: -82, latitude: 40 }, 5, callback)
});
