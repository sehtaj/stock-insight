import { ThemeToggle } from "@/components/theme-toggle";
import { InteractiveStockChart } from "@/components/InteractiveStockChart";
import { StockSelector } from "@/components/StockSelector";
import { Suspense, useEffect, useState } from "react";
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

  // Create a promise to fetch stock data
  const stockDataPromise = async (): Promise<StockData[]> => {
    try {
      const response = await fetch(`/api/stocks/${ticker}`);
      if (!response.ok) {
        throw new Error("Failed to fetch stock data");
      }
      const data = await response.json();
      return data; // Return the fetched data
    } catch (error: unknown) {
      console.error(error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred.");
      }
      return []; // Return an empty array on error to avoid further issues
    }
  };

  return (
    <div className='min-h-screen pt-6 pb-12 lg:px-12 px-3'>
      <nav className='w-full flex flex-row gap-2 justify-end'>
        <Link
          href={"https://github.com/sehtaj/stock-insight"}
          target='_blank'
          rel='noreferrer'>
          <div
            className={cn(
              buttonVariants({
                variant: "ghost",
              }),
              "h-[40px] w-[40px] px-0"
            )}>
            <GithubIcon className='h-[1.2rem] w-[1.2rem]' />
            <span className='sr-only'>GitHub</span>
          </div>
        </Link>
        <ThemeToggle />
      </nav>
      <main className='w-full pt-20 flex flex-col gap-4 mx-auto max-w-screen-lg flex-col items-center'>
        <StockSelector />
        <ErrorBoundary
          fallback={
            <span className='text-sm text-red-600'>
              Error with Polygon.io API 😅 - Please try again later.
            </span>
          }>
          <Suspense
            fallback={
              <span className='justify-self-center self-center text-sm text-white'>
                Fetching price…
              </span>
            }>
            {error ? (
              <span className='text-sm text-red-600'>{error}</span>
            ) : (
              <InteractiveStockChart chartData={stockDataPromise()} ticker={ticker} />
            )}
          </Suspense>
        </ErrorBoundary>
      </main>
    </div>
  );
}
