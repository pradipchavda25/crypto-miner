import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bitcoin, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { useGameContext } from '../GameContext';

const CryptoClicker: React.FC = () => {
  const { state, dispatch } = useGameContext();
  const { toast } = useToast();
  const [clickCount, setClickCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isGameActive, setIsGameActive] = useState(false);
  const [highScore, setHighScore] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isGameActive && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0) {
      endGame();
    }
    return () => clearTimeout(timer);
  }, [isGameActive, timeLeft]);

  const startGame = () => {
    setIsGameActive(true);
    setClickCount(0);
    setTimeLeft(30);
  };

  const endGame = () => {
    setIsGameActive(false);
    if (clickCount > highScore) {
      setHighScore(clickCount);
      dispatch({ type: 'MINE', payload: clickCount });
      toast({
        title: "New High Score!",
        description: `You mined ${clickCount} crypto!`,
      });
    }
  };

  const handleClick = () => {
    if (isGameActive) {
      setClickCount(clickCount + 1);
    }
  };

  return (
    <Card className="bg-neutral-900 border-neutral-900">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-white flex items-center">
          <Bitcoin className="mr-2" /> Crypto Clicker
        </CardTitle>
        <CardDescription className="text-neutral-400">
          Click as fast as you can to mine crypto!
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-6">
        <motion.div
          animate={{ scale: isGameActive ? [1, 1.1, 1] : 1 }}
          transition={{ duration: 0.2, repeat: isGameActive ? Infinity : 0, repeatType: "reverse" }}
          className="w-full flex justify-center"
        >
          <Button
            size="lg"
            onClick={handleClick}
            disabled={!isGameActive}
            className={`w-32 h-32 rounded-full ${isGameActive ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-neutral-700'} transition-colors duration-200`}
          >
            <Zap className={`w-20 h-20 ${isGameActive ? 'text-neutral-900' : 'text-neutral-500'}`} />
          </Button>
        </motion.div>
        <div className="text-center w-full">
          <p className="text-4xl font-bold text-yellow-500 mb-2">{clickCount}</p>
          <p className="text-sm text-neutral-400">Clicks</p>
        </div>
        <Progress value={(timeLeft / 30) * 100} className="w-full bg-neutral-700" />
        <div className="flex justify-between w-full text-sm text-neutral-400">
          <span>Time left: {timeLeft}s</span>
          <span>High Score: {highScore}</span>
        </div>
        {!isGameActive && (
          <Button onClick={startGame} className="w-full bg-yellow-500 hover:bg-yellow-600 text-neutral-900 font-bold">
            Start Mining
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default CryptoClicker;