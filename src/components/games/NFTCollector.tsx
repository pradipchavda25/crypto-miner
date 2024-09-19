import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useGameContext } from '../GameContext';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Sparkles, SkipForward, Clock } from 'lucide-react';

type NFT = {
  id: number;
  name: string;
  rarity: string;
  value: number;
};

const nfts: NFT[] = [
  { id: 1, name: 'CryptoPunk', rarity: 'Rare', value: 100 },
  { id: 2, name: 'Bored Ape', rarity: 'Epic', value: 200 },
  { id: 3, name: 'Doodle', rarity: 'Common', value: 50 },
  { id: 4, name: 'Art Blocks', rarity: 'Uncommon', value: 75 },
  { id: 5, name: 'CryptoKitty', rarity: 'Rare', value: 100 },
  { id: 6, name: 'Azuki', rarity: 'Epic', value: 180 },
  { id: 7, name: 'CloneX', rarity: 'Rare', value: 120 },
  { id: 8, name: 'Moonbird', rarity: 'Uncommon', value: 90 },
];

const rarityColors = {
  Common: 'bg-neutral-500',
  Uncommon: 'bg-green-500',
  Rare: 'bg-blue-500',
  Epic: 'bg-purple-500',
};

export default function NFTCollector() {
  const { dispatch } = useGameContext();
  const { toast } = useToast();
  
  const [collection, setCollection] = useState<NFT[]>([]);
  const [currentNFT, setCurrentNFT] = useState<NFT | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [score, setScore] = useState<number>(0);

  useEffect(() => {
    newNFT();

    const timer = setInterval(() => {
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

  const newNFT = () => {
    const randomNFT = nfts[Math.floor(Math.random() * nfts.length)];
    setCurrentNFT(randomNFT);
  };

  const collectNFT = () => {
    if (currentNFT) {
      setCollection([...collection, currentNFT]);
      setScore(prevScore => prevScore + currentNFT.value);
      dispatch({ type: 'MINE', payload: currentNFT.value });
      toast({
        title: 'NFT Collected!',
        description: `You collected a ${currentNFT.rarity} ${currentNFT.name}!`,
      });
      newNFT();
    }
  };

  const skipNFT = () => {
    newNFT();
  };

  const endGame = () => {
    const totalValue = collection.reduce((sum, nft) => sum + nft.value, 0);
    toast({
      title: 'Game Over',
      description: `You collected ${collection.length} NFTs worth ${totalValue} crypto!`,
    });
    dispatch({ type: 'MINE', payload: Math.floor(totalValue / 10) });
  };

  return (
    <Card className="bg-neutral-900 border-neutral-900 max-w-sm mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-white flex justify-between items-center">
          <span>NFT Collector</span>
          <Badge variant="secondary" className="text-lg">
            <Clock className="w-4 h-4 mr-1" />
            {timeLeft}s
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center space-y-4">
          {currentNFT && (
            <div className="text-center w-full bg-neutral-800 p-4 rounded-lg">
              <p className="text-2xl font-bold text-white mb-2">{currentNFT.name}</p>
              <Badge className={`${rarityColors[currentNFT.rarity as keyof typeof rarityColors]} text-white mb-2`}>
                {currentNFT.rarity}
              </Badge>
              <p className="text-lg text-yellow-400 font-semibold">Value: {currentNFT.value} crypto</p>
            </div>
          )}
          <div className="flex space-x-4 w-full">
            <Button onClick={collectNFT} className="bg-green-600 hover:bg-green-700 text-white flex-1">
              <Sparkles className="w-4 h-4 mr-2" />
              Collect
            </Button>
            <Button onClick={skipNFT} className="bg-red-600 hover:bg-red-700 text-white flex-1">
              <SkipForward className="w-4 h-4 mr-2" />
              Skip
            </Button>
          </div>
          <div className="w-full space-y-2">
            <p className="text-sm text-neutral-400">Collection: {collection.length} NFTs</p>
            <p className="text-sm text-neutral-400">Score: {score} crypto</p>
            <Progress value={(score / 1000) * 100} className="w-full" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}