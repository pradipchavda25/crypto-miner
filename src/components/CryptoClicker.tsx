"use client"

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Bitcoin, Zap } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useGameContext } from './GameContext'
import confetti from 'canvas-confetti'

export default function CryptoClicker() {
  const { state, dispatch } = useGameContext()
  const [clickCount, setClickCount] = useState(0)
  const [timeLeft, setTimeLeft] = useState(30)
  const [isGameActive, setIsGameActive] = useState(false)
  const [highScore, setHighScore] = useState(0)

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isGameActive && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
    } else if (timeLeft === 0) {
      endGame()
    }
    return () => clearTimeout(timer)
  }, [isGameActive, timeLeft])

  const startGame = () => {
    setIsGameActive(true)
    setClickCount(0)
    setTimeLeft(30)
  }

  const endGame = () => {
    setIsGameActive(false)
    if (clickCount > highScore) {
      setHighScore(clickCount)
      // Mine Bitcoin based on click count
      for (let i = 0; i < clickCount; i++) {
        dispatch({ type: 'MINE' })
      }
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
      })
    }
  }

  const handleClick = () => {
    if (isGameActive) {
      setClickCount(clickCount + 1)
    }
  }

  return (
    <Card className="mb-4 bg-neutral-900 border-neutral-700">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-white">Crypto Clicker</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center space-y-4">
          <motion.div
            animate={{ scale: isGameActive ? [1, 1.1, 1] : 1 }}
            transition={{ duration: 0.2, repeat: isGameActive ? Infinity : 0, repeatType: "reverse" }}
          >
            <Button
              size="lg"
              onClick={handleClick}
              disabled={!isGameActive}
              className="w-32 h-32 rounded-full bg-neutral-700 hover:bg-neutral-700 disabled:opacity-50"
            >
              <Bitcoin className="w-16 h-16 text-white" />
            </Button>
          </motion.div>
          <div className="text-center">
            <p className="text-2xl font-bold text-white">{clickCount}</p>
            <p className="text-sm text-neutral-400">Clicks</p>
          </div>
          <Progress value={(timeLeft / 30) * 100} className="w-full bg-neutral-700"  />
          <p className="text-sm text-neutral-400">Time left: {timeLeft}s</p>
          {!isGameActive && (
            <Button onClick={startGame} className="bg-neutral-700 hover:bg-neutral-600 text-white">
              Start Game
            </Button>
          )}
          <p className="text-sm text-neutral-400">High Score: {highScore}</p>
        </div>
      </CardContent>
    </Card>
  )
}