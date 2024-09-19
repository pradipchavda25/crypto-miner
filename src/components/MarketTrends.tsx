import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

type CryptoData = {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  total_volume: number;
};

const formatNumber = (num: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 2
  }).format(num);
};

// Fallback data in case of API failure
const fallbackData: CryptoData[] = [
  {
    id: "bitcoin",
    symbol: "btc",
    name: "Bitcoin",
    image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
    current_price: 59461,
    price_change_percentage_24h: -2.75359,
    market_cap: 1174884989445,
    total_volume: 29904054195
  },
  // ... add more fallback data for other cryptocurrencies
];

const CACHE_KEY = 'cryptoMarketData';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export default function MarketTrends() {
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWithExponentialBackoff = async (url: string, retries = 3, delay = 1000) => {
    try {
      const response = await fetch(url);
      if (response.status === 429) {
        if (retries > 0) {
          await new Promise(resolve => setTimeout(resolve, delay));
          return fetchWithExponentialBackoff(url, retries - 1, delay * 2);
        } else {
          throw new Error('Rate limit exceeded');
        }
      }
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  };

  const fetchCryptoData = async () => {
    try {
      setIsLoading(true);
      
      // Check cache first
      const cachedData = localStorage.getItem(CACHE_KEY);
      if (cachedData) {
        const { data, timestamp } = JSON.parse(cachedData);
        if (Date.now() - timestamp < CACHE_DURATION) {
          setCryptoData(data);
          setError(null);
          setIsLoading(false);
          return;
        }
      }

      const data = await fetchWithExponentialBackoff(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=5&page=1&sparkline=false"
      );
      
      setCryptoData(data);
      setError(null);
      
      // Update cache
      localStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() }));
    } catch (error) {
      console.error("Error fetching crypto data:", error);
      setError('Failed to load fresh data. Displaying cached or fallback data.');
      
      // Use cached data if available, otherwise use fallback data
      const cachedData = localStorage.getItem(CACHE_KEY);
      if (cachedData) {
        const { data } = JSON.parse(cachedData);
        setCryptoData(data);
      } else {
        setCryptoData(fallbackData);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCryptoData();
    const interval = setInterval(fetchCryptoData, 5 * 60 * 1000); // Update every 5 minutes
    return () => clearInterval(interval);
  }, []);

  // ... (rest of the component remains the same)

  return (
    <Card className="w-full bg-neutral-900 border-neutral-700">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-white">Crypto Market Trends</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs text-neutral-400">Asset</TableHead>
              <TableHead className="text-xs text-neutral-400 text-right">Price</TableHead>
              <TableHead className="text-xs text-neutral-400 text-right">24h</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cryptoData.map((crypto) => (
              <TableRow key={crypto.id}>
                <TableCell className="py-2">
                  <div className="flex items-center space-x-2">
                    <img src={crypto.image} alt={crypto.name} className="w-6 h-6" />
                    <div>
                      <div className="font-medium text-white">{crypto.name}</div>
                      <div className="text-xs text-neutral-400">{crypto.symbol.toUpperCase()}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right text-sm text-white">
                  {formatNumber(crypto.current_price)}
                </TableCell>
                <TableCell className="text-right">
                  <span className={`flex items-center justify-end text-sm ${
                    crypto.price_change_percentage_24h >= 0 ? "text-green-500" : "text-red-500"
                  }`}>
                    {crypto.price_change_percentage_24h >= 0 ? (
                      <TrendingUp size={16} className="mr-1" />
                    ) : (
                      <TrendingDown size={16} className="mr-1" />
                    )}
                    {Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}