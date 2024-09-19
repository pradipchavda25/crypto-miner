import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useGameContext } from '../GameContext';
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';

interface Crypto {
  name: string;
  price: number;
  owned: number;
  change: number;
}

const initialCryptos: Crypto[] = [
  { name: 'BTC', price: 30000, owned: 0, change: 0 },
  { name: 'ETH', price: 2000, owned: 0, change: 0 },
  { name: 'DOGE', price: 0.1, owned: 0, change: 0 },
];

const TradingSimulator: React.FC = () => {
  const { dispatch } = useGameContext();
  const { toast } = useToast();
  const [cryptos, setCryptos] = useState<Crypto[]>(initialCryptos);
  const [balance, setBalance] = useState<number>(10000);
  const [selectedCrypto, setSelectedCrypto] = useState<Crypto | null>(null);
  const [tradeAmount, setTradeAmount] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<number>(120);

  useEffect(() => {
    const timer = setInterval(() => {
      updatePrices();
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          endGame();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const updatePrices = () => {
    setCryptos(prevCryptos => prevCryptos.map(crypto => {
      const change = (Math.random() - 0.5) * 0.1;
      return {
        ...crypto,
        price: Math.max(0.01, crypto.price * (1 + change)),
        change: change * 100
      };
    }));
  };

  const selectCrypto = (crypto: Crypto) => {
    setSelectedCrypto(crypto);
    setTradeAmount('');
  };

  const handleTrade = (isBuying: boolean) => {
    if (!selectedCrypto || !tradeAmount) return;

    const amount = parseFloat(tradeAmount);
    const totalPrice = amount * selectedCrypto.price;

    if (isBuying && totalPrice > balance) {
      toast({
        title: "Insufficient funds",
        description: "You don't have enough balance for this trade.",
        variant: "destructive",
      });
      return;
    }

    if (!isBuying && amount > selectedCrypto.owned) {
      toast({
        title: "Insufficient crypto",
        description: "You don't own enough of this cryptocurrency to sell.",
        variant: "destructive",
      });
      return;
    }

    setCryptos(prevCryptos => prevCryptos.map(crypto =>
      crypto.name === selectedCrypto.name
        ? { ...crypto, owned: isBuying ? crypto.owned + amount : crypto.owned - amount }
        : crypto
    ));

    setBalance(prevBalance => isBuying ? prevBalance - totalPrice : prevBalance + totalPrice);

    toast({
      title: isBuying ? "Bought Crypto" : "Sold Crypto",
      description: `${isBuying ? 'Bought' : 'Sold'} ${amount} ${selectedCrypto.name} for $${totalPrice.toFixed(2)}`,
    });

    setTradeAmount('');
  };

  const endGame = () => {
    const totalValue = cryptos.reduce((sum, crypto) => sum + crypto.owned * crypto.price, 0) + balance;
    const profit = totalValue - 10000;
    toast({
      title: "Game Over",
      description: `Your final portfolio value: $${totalValue.toFixed(2)}. Profit: $${profit.toFixed(2)}`,
    });
    dispatch({ type: 'MINE', payload: Math.max(0, Math.floor(profit / 100)) });
  };

  return (
    <Card className="bg-neutral-900 border-neutral-900 max-w-sm mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-white">Crypto Trader</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between text-white">
            <span>Balance: ${balance.toFixed(2)}</span>
            <span>Time: {timeLeft}s</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {cryptos.map(crypto => (
              <Button
                key={crypto.name}
                onClick={() => selectCrypto(crypto)}
                className={`bg-neutral-800 hover:bg-neutral-700 text-white h-auto py-2 ${selectedCrypto?.name === crypto.name ? 'ring-2 ring-blue-500' : ''}`}
              >
                <div className="flex flex-col gap-1 items-center">
                  <span className="font-bold">{crypto.name}</span>
                  <span className="text-xs">${crypto.price.toFixed(2)}</span>
                  <span className={`text-xs flex items-center ${crypto.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {crypto.change >= 0 ? <ArrowUpIcon size={12} /> : <ArrowDownIcon size={12} />}
                    {Math.abs(crypto.change).toFixed(2)}%
                  </span>
                </div>
              </Button>
            ))}
          </div>
          {selectedCrypto && (
            <div className="flex flex-col space-y-2">
              <p className="text-white text-center">Trading {selectedCrypto.name}</p>
              <p className="text-white text-center text-sm">Owned: {selectedCrypto.owned.toFixed(4)}</p>
              <Input
                type="number"
                value={tradeAmount}
                onChange={(e) => setTradeAmount(e.target.value)}
                className="bg-neutral-800 text-white"
                placeholder="Amount to trade"
              />
              <div className="flex space-x-2">
                <Button onClick={() => handleTrade(true)} className="bg-green-600 hover:bg-green-700 text-white flex-1">
                  Buy
                </Button>
                <Button onClick={() => handleTrade(false)} className="bg-red-600 hover:bg-red-700 text-white flex-1">
                  Sell
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TradingSimulator;