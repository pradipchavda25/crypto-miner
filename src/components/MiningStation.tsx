"use client"

import React, { useState, useEffect } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { Bitcoin, Zap, Cpu } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useGameContext } from './GameContext'
import confetti from "canvas-confetti"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function MiningStation() {
  const { state, dispatch } = useGameContext()
  const [miningProgress, setMiningProgress] = useState(0)
  const controls = useAnimation()
  const [isHovering, setIsHovering] = useState(false)
  const [particleCount, setParticleCount] = useState(0)

  useEffect(() => {
    controls.start({
      rotate: [0, 360],
      transition: { duration: 2, repeat: Infinity, ease: "linear" }
    })
  }, [controls])

  useEffect(() => {
    const timer = setInterval(() => {
      dispatch({ type: 'MINE_PASSIVE', payload: 1 })
      setMiningProgress((prev) => (prev + 5) % 100)
    }, 1000)
    return () => clearInterval(timer)
  }, [dispatch])

  const handleMine = () => {
    dispatch({ type: 'MINE', payload: 0 })
    setMiningProgress((prev) => (prev + 20) % 100)
    controls.start({
      scale: [1, 1.2, 1],
      transition: { duration: 0.3 }
    })

    setParticleCount((prev) => prev + 1)

    // Trigger confetti
    confetti({
      particleCount: 30,
      spread: 90,
      origin: { y: 0.6 },
    })

    // Simulate mining completion
    if (miningProgress + 20 >= 100) {
      setTimeout(() => {
        confetti({
          particleCount: 300,
          spread: 160,
          origin: { y: 0.6 },
          colors: ['#FFD700', '#FFA500', '#FF8C00']
        })
      }, 300)
    }
  }

  return (
    <Card className="mb-4 bg-gradient-to-br from-neutral-900 to-neutral-800 border-neutral-700 pt-0 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/circuit-board.svg')] opacity-10 z-0"></div>
      <CardHeader className="relative z-10">
        <CardTitle className="text-xl sm:text-2xl font-bold text-yellow-500">Crypto Mining Station</CardTitle>
        <CardDescription className="text-neutral-400">Harness the power of blockchain</CardDescription>
      </CardHeader>
      <CardContent className="relative z-10">
        <motion.div
          className="flex justify-center items-center"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onHoverStart={() => setIsHovering(true)}
          onHoverEnd={() => setIsHovering(false)}
        >
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="lg"
                  onClick={handleMine}
                  disabled={state.energy < 0.1}
                  className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-yellow-600 hover:bg-yellow-500 shadow-lg shadow-yellow-500/50 disabled:opacity-50 relative overflow-hidden"
                >
                  <motion.div 
                    animate={controls}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <Bitcoin className="w-16 h-16 sm:w-20 sm:h-20 text-white" />
                  </motion.div>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Click to mine Bitcoin</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </motion.div>
        <div className="mt-6 space-y-2">
          <div className="flex justify-between text-sm text-neutral-400">
            <span>Mining Progress</span>
            <span>{miningProgress}%</span>
          </div>
          <Progress value={miningProgress} className="h-2 bg-neutral-700" />
        </div>
        <div className="mt-4 text-center">
          <p className="text-2xl font-bold text-yellow-500">{particleCount}</p>
          <p className="text-sm text-neutral-400">Particles Mined</p>
        </div>
      </CardContent>
      <CardFooter className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
        <div className="flex items-center space-x-2">
          <Cpu className="w-4 h-4 text-neutral-400" />
          <p className="text-sm text-neutral-400">Mining rate: <span className="font-mono text-yellow-500">{state.miningRate.toFixed(8)} BTC/click</span></p>
        </div>
        <div className="flex items-center space-x-2">
          <Zap className="w-4 h-4 text-neutral-400" />
          <p className="text-sm text-neutral-400">Energy cost: <span className="font-mono text-yellow-500">0.1/click</span></p>
        </div>
      </CardFooter>
    </Card>
  )
}