"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAugmentedFetchUrl = void 0;
exports.getStockData = getStockData;
const express_1 = require("express");
//const BASE_URL = `https://api.polygon.io/v2/aggs/ticker/TICKER/range/1/day/FROM_DATE/TO_DATE?adjusted=true&sort=asc&apiKey=${process.env.POLYGON_API_KEY}`;
const getAugmentedFetchUrl = (ticker, from, to) => {
    const apiKey = process.env.POLYGON_API_KEY; // Access here
    return `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${from}/${to}?adjusted=true&sort=asc&apiKey=${apiKey}`;
};
exports.getAugmentedFetchUrl = getAugmentedFetchUrl;
const formatDate = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
};
const DAYS_AGO = 100;
const getEndpoint = (ticker) => {
    const today = new Date();
    const last7Days = new Date(today);
    last7Days.setDate(today.getDate() - DAYS_AGO);
    const from = formatDate(last7Days);
    const to = formatDate(today);
    return (0, exports.getAugmentedFetchUrl)(ticker, from, to);
};
function getStockData() {
    return __awaiter(this, arguments, void 0, function* (ticker = "NVDA") {
        const res = yield fetch(getEndpoint(ticker), {
            headers: {
                "Content-Type": "application/json",
            }
        });
        const data = yield res.json();
        if (!data.results || !Array.isArray(data.results)) {
            throw new Error("Failed to fetch stock data");
        }
        const stockDataArray = data.results.map((item) => ({
            date: new Date(item.t).toISOString().split("T")[0], // Convert timestamp to YYYY-MM-DD
            open: item.o,
            high: item.h,
            low: item.l,
            close: item.c,
            volume: item.v,
        }));
        return stockDataArray;
    });
}
const router = (0, express_1.Router)();
// Existing routes
router.get('/hello', (req, res) => {
    res.json({ message: 'Hello, World!' });
});
router.get('/goodbye', (req, res) => {
    res.json({ message: 'Goodbye, World!' });
});
// New stock data route
router.get('/:ticker', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ticker } = req.params;
    try {
        const stockData = yield getStockData(ticker);
        res.json(stockData);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message }); // Use type assertion here
    }
}));
exports.default = router;
