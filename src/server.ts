import { BitvavoService } from "./services/bitvavo.service";

const express = require('express');
const app = express();
const cors = require('cors');

const bitvavoService = new BitvavoService();

// const { MongoClient } = require('mongodb');



const corsOptions = {
    origin: 'http://localhost:4200', // portnumber has to be included
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.get('/api/fees', cors(corsOptions), async function (req, res) {
    try {
        const response = await bitvavoService.getFees();
        return res.json(response);
    } catch (err) {
        console.log(err);
    }
});

app.get('/api/assets', cors(corsOptions), async function (req, res) {
    try {
        const response = await bitvavoService.getAssets();
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