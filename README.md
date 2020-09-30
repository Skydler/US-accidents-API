# US-accidents-API
API made to query a dataset of US accidents

## Requirements
 - [MongoDB](https://docs.mongodb.com/manual/installation/)
 - [database-tools](https://docs.mongodb.com/database-tools/installation/#install-tools)
 - [Node](https://nodejs.org/en/download/)

## Installation
```sh
    bash ./install.sh PATH_TO_CSV_FILE
```

Installation will import the csv data on "accidents" collection under "accidents" db 

You should also create a `.env` file with the corresponding server configuration. See `.env.example` for an example.

## Usage
```sh
    node index.js
```

This will start the API server on port 3000

## API

### **/between**
Returns all the accidents that happened between two dates.  
Parameters:
- startDate: the start date (for example, '2019-03-10')
- endDate: the end date (for example, '2019-03-11')
- limit: used to limit the returned documents.

### **/accidentsWithin**
Returns the accidents within a certain area.  
Parameters:
- longitude: a longitude (for example, '-84.058723')
- latitude: a latitude (for example, '39.865147')
- radius: a radius (in km)
- limit: used to limit the returned documents

### **/mostDangerousPoints**
Returns the most dangerous points within a certain area.  
Parameters:
- longitude: a longitude (for example, '-84.058723')
- latitude: a latitude (for example, '39.865147')
- radius: a radius (in km)
- limit: used to limit the returned documents

### **/averageDistance**
Returns the average distance of all the accidents, between their start point and end point. 

### **/mostCommonConditions/weather**
Returns the most common weather conditions.

### **/mostCommonConditions/location**
Returns the most common location data.

### **/mostCommonConditions/weather**
Returns the most common terrain conditions.

## Clarifications
We had to modify the Mongo collection schema by adding two geo points to all the accidents. Some of them already had an end point, but in those cases where they don't, we used the start point.

We used both the start and the end point to determine if an accident happened in a certain area.