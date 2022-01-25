const express = require('express');
const app = express();
const cors = require('cors');

// const { MongoClient } = require('mongodb');

const { bitvavo } = require('./bitvavo-api');

const corsOptions = {
    origin: 'http://localhost:4200', // portnumber has to be included
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.get('/api/test', cors(corsOptions), async function (req, res) {
    try {
        const response = await bitvavo.assets({});
        return res.json(response);
    } catch (err) {
        console.log(err);
    }
});

// start the server listening for requests
app.listen(
    process.env.PORT || 3000,
    () => console.log("Server is running...")
);