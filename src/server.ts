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

app.get('/api/balance/:symbol?', cors(corsOptions), async function (req, res) {
    try {
        const response = await bitvavoService.getBalance(req.params.symbol);
        return res.json(response);
    } catch (err) {
        console.log(err);
    }
});

app.get('/api/tickerprices/:market?', cors(corsOptions), async function (req, res) {
    try {
        const response = await bitvavoService.getTickerPrices(req.params.market);
        return res.json(response);
    } catch (err) {
        console.log(err);
    }
});

app.get('/api/tickerprices24h', cors(corsOptions), async function (req, res) {
    try {
        const response = await bitvavoService.getTickerPrices24h();
        return res.json(response);
    } catch (err) {
        console.log(err);
    }
});

app.get('/api/candles/:market/:interval/:limit?', cors(corsOptions), async function (req, res) {
    try {
        const response = await bitvavoService.getCandles(req.params.market, req.params.interval, req.params.limit);
        return res.json(response);
    } catch (err) {
        console.log(err);
    }
});

app.get('/api/trades/:market', cors(corsOptions), async function (req, res) {
    try {
        const response = await bitvavoService.getTrades(req.params.market);
        return res.json(response);
    } catch (err) {
        console.log(err);
    }
});

app.get('/api/openorders', cors(corsOptions), async function (req, res) {
    try {
        const response = await bitvavoService.getOpenOrders();
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