import { Router, Request, Response } from 'express';

//const BASE_URL = `https://api.polygon.io/v2/aggs/ticker/TICKER/range/1/day/FROM_DATE/TO_DATE?adjusted=true&sort=asc&apiKey=${process.env.POLYGON_API_KEY}`;

export const getAugmentedFetchUrl = (
  ticker: string,
  from: string,
  to: string
) => {
  const apiKey = process.env.POLYGON_API_KEY; // Access here
  return `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${from}/${to}?adjusted=true&sort=asc&apiKey=${apiKey}`;
};


const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const DAYS_AGO = 100;

const getEndpoint = (ticker: string): string => {
  const today = new Date();
  const last7Days = new Date(today);
  last7Days.setDate(today.getDate() - DAYS_AGO);

  const from = formatDate(last7Days);
  const to = formatDate(today);

  return getAugmentedFetchUrl(ticker, from, to);
};

export interface StockData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export async function getStockData(
  ticker: string = "NVDA"
): Promise<StockData[]> {
  const res = await fetch(getEndpoint(ticker), {
    headers: {
      "Content-Type": "application/json",
    }
  });

  const data = await res.json();

  if (!data.results || !Array.isArray(data.results)) {
    throw new Error("Failed to fetch stock data");
  }

  const stockDataArray: StockData[] = data.results.map((item: any) => ({
    date: new Date(item.t).toISOString().split("T")[0], // Convert timestamp to YYYY-MM-DD
    open: item.o,
    high: item.h,
    low: item.l,
    close: item.c,
    volume: item.v,
  }));

  return stockDataArray;
}

const router = Router();

// Existing routes
router.get('/hello', (req: Request, res: Response) => {
  res.json({ message: 'Hello, World!' });
});

router.get('/goodbye', (req: Request, res: Response) => {
  res.json({ message: 'Goodbye, World!' });
});


// New stock data route
router.get('/:ticker', async (req: Request, res: Response) => {
  const { ticker } = req.params;

  try {
    const stockData = await getStockData(ticker);
    res.json(stockData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: (error as Error).message }); // Use type assertion here
  }
});

export default router;
