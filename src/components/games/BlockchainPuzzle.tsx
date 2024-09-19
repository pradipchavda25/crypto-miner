import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useGameContext } from '../GameContext';
import { Lock, Unlock } from 'lucide-react';

interface Puzzle {
  question: string;
  answer: number;
}

const generatePuzzle = (): Puzzle => {
  const operations = ['+', '-', '*'];
  const num1 = Math.floor(Math.random() * 10) + 1;
  const num2 = Math.floor(Math.random() * 10) + 1;
  const operation = operations[Math.floor(Math.random() * operations.length)];
  let answer: number;

  switch (operation) {
    case '+':
      answer = num1 + num2;
      break;
    case '-':
      answer = num1 - num2;
      break;
    case '*':
      answer = num1 * num2;
      break;
    default:
      answer = 0;
  }

  return { question: `${num1} ${operation} ${num2}`, answer };
};

const BlockchainPuzzle: React.FC = () => {
  const { dispatch } = useGameContext();
  const { toast } = useToast();
  const [puzzle, setPuzzle] = useState<Puzzle>(generatePuzzle());
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [score, setScore] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [isGameActive, setIsGameActive] = useState<boolean>(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isGameActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      endGame();
    }
    return () => clearInterval(timer);
  }, [isGameActive, timeLeft]);

  const startGame = () => {
    setIsGameActive(true);
    setScore(0);
    setTimeLeft(60);
    setPuzzle(generatePuzzle());
  };

  const checkAnswer = () => {
    if (parseInt(userAnswer) === puzzle.answer) {
      setScore(score + 1);
      dispatch({ type: 'MINE', payload: 5 });
      toast({
        title: "Correct!",
        description: "You unlocked the blockchain!",
      });
      setPuzzle(generatePuzzle());
      setUserAnswer('');
    } else {
      toast({
        title: "Incorrect",
        description: "Try again!",
        variant: "destructive",
      });
    }
  };

  const endGame = () => {
    setIsGameActive(false);
    toast({
      title: "Game Over",
      description: `Your final score is ${score}`,
    });
    dispatch({ type: 'MINE', payload: score * 5 });
  };

  return (
    <Card className="bg-neutral-900 border-neutral-900">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-white flex items-center">
          <Lock className="mr-2" /> Blockchain Puzzle
        </CardTitle>
        <CardDescription className="text-neutral-400">
          Solve the puzzles to unlock the blockchain!
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-6">
        {isGameActive ? (
          <>
            <div className="text-center">
              <p className="text-3xl font-bold text-white mb-4">{puzzle.question} = ?</p>
              <Input
                type="number"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                className="bg-neutral-800 text-white text-center text-2xl"
                placeholder="Your answer"
              />
            </div>
            <Button onClick={checkAnswer} className="w-full bg-yellow-500 hover:bg-yellow-600 text-neutral-900 font-bold">
              Unlock <Unlock className="ml-2" />
            </Button>
            <div className="flex justify-between w-full text-sm text-neutral-400">
              <span>Time left: {timeLeft}s</span>
              <span>Score: {score}</span>
            </div>
          </>
        ) : (
          <Button onClick={startGame} className="w-full bg-yellow-500 hover:bg-yellow-600 text-neutral-900 font-bold">
            Start Puzzle
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default BlockchainPuzzle;