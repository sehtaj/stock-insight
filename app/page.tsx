"use client"; // This ensures the component is treated as a client component.
import { ThemeToggle } from "@/components/theme-toggle";
import { InteractiveStockChart } from "@/components/InteractiveStockChart";
import { StockSelector } from "@/components/StockSelector";
import { useEffect, useState, useRef } from "react";
import { companies } from "@/lib/stock-data";
import { ErrorBoundary } from "react-error-boundary";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import GithubIcon from "@/components/icons/GithubIcon";
import { cn } from "@/lib/utils";

// Define the StockData interface
interface StockData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export default function Home({
  searchParams,
}: {
  searchParams: { ticker?: string };
}) {
  const ticker = searchParams.ticker || companies[0].ticker;
  const [error, setError] = useState<string | null>(null);
  const [stockData, setStockData] = useState<StockData[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const chartDataRef = useRef<Promise<StockData[]>>(Promise.resolve([])); // Initialized with a resolved promise

  
  useEffect(() => {
    const fetchStockData = async () => {
      setLoading(true); // Set loading state
      try {
        const response = await fetch(`http://localhost:3001/${ticker}`);
        // Check if the response is ok (status in the range 200-299)
        if (!response.ok) {
          throw new Error("Failed to fetch stock data");
        }

        // Parse the JSON response
        const data: StockData[] = await response.json();
        setStockData(data); // Set fetched stock data
        setError(null); // Reset error if successful
        // Update the ref with the resolved promise
        chartDataRef.current = Promise.resolve(data);
      } catch (error: unknown) {
        console.error("Fetch error:", error); // Enhanced error logging
        setError(error instanceof Error ? error.message : "An unexpected error occurred.");
        setStockData(null); // Reset stock data on error
      } finally {
        setLoading(false); // Set loading state to false after fetching
      }
    };

    fetchStockData(); // Call the async function
  }, [ticker]);

  return (
    <div className="min-h-screen pt-6 pb-12 lg:px-12 px-3">
      <nav className="w-full flex flex-row gap-2 justify-end">
        <Link
          href={"https://github.com/sehtaj/stock-insight"}
          target="_blank"
          rel="noreferrer"
        >
          <div
            className={cn(
              buttonVariants({
                variant: "ghost",
              }),
              "h-[40px] w-[40px] px-0"
            )}
          >
            <GithubIcon className="h-[1.2rem] w-[1.2rem]" />
            <span className="sr-only">GitHub</span>
          </div>
        </Link>
        <ThemeToggle />
      </nav>
      <main className="w-full pt-20 flex flex-col gap-4 mx-auto max-w-screen-lg flex-col items-center">
        <StockSelector />
        <ErrorBoundary
          fallback={
            <span className="text-sm text-red-600">
              Error with Polygon.io API 😅 - Please try again later.
            </span>
          }
        >
          {error ? (
            <span className="text-sm text-red-600">{error}</span>
          ) : loading ? (
            <span className="justify-self-center self-center text-sm text-white">
              Fetching price…
            </span>
          ) : stockData ? (
            // Pass the resolved promise of stockData to the chart
            <InteractiveStockChart chartData={chartDataRef.current} ticker={ticker} />
          ) : (
            <span className="text-sm text-red-600">No stock data available</span>
          )}
        </ErrorBoundary>
      </main>
    </div>
  );
}
