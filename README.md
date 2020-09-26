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

## Usage
```sh
    node index.js
```

This will start the API server on port 3000
