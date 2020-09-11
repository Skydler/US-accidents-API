function parseTerrainConditions(values) {
    const conditions = [
        'Crossing',
        'Giveaway',
        'Junction',
        'No Exit',
        'Railway',
        'Stop',
        'Turning Loop',
        'Station'
    ];
    return parse(values, conditions);
}

function parseLocationConditions(values) {
    const conditions = [
        'Time',
        'City',
        'State'
    ];
    return parse(values, conditions);
}

function parseWeatherConditions(values) {
    const conditions = [
        'Weather',
        'Visibility',
        'Temperature',
        'Wind'
    ];
    return parse(values, conditions);
}

function parse(values, conditions) {
    return values.reduce((acc, value, index) => {
        const objIndex = conditions[index];
        return {
            ...acc,
            [objIndex]: value
        };
    }, {})
}

module.exports = {
    parseTerrainConditions,
    parseLocationConditions,
    parseWeatherConditions
}