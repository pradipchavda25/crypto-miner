"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bitcoin, Cpu, Zap, Server, Database } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/ui/use-toast"
import { useGameContext } from './GameContext'

const UPGRADE_TYPES = [
  { name: 'CPU Miner', icon: Cpu, baseMultiplier: 2, costMultiplier: 1.5 },
  { name: 'GPU Rig', icon: Zap, baseMultiplier: 5, costMultiplier: 2 },
  { name: 'ASIC Miner', icon: Server, baseMultiplier: 10, costMultiplier: 3 },
  { name: 'Mining Farm', icon: Database, baseMultiplier: 20, costMultiplier: 5 },
]

export default function Upgrades() {
  const { state, dispatch } = useGameContext()
  const [hoveredUpgrade, setHoveredUpgrade] = useState<number | null>(null)
  const { toast } = useToast()

  const upgrade = (index: number) => {
    const upgradeCost = calculateUpgradeCost(index)
    if (state.balance >= upgradeCost) {
      dispatch({ type: 'UPGRADE', payload: index })
      toast({
        title: "Upgrade Successful!",
        description: `You've upgraded your ${UPGRADE_TYPES[index].name}!`,
        duration: 3000,
      })
    } else {
      toast({
        title: "Insufficient Funds",
        description: "You don't have enough BTC for this upgrade.",
        variant: "destructive",
        duration: 3000,
      })
    }
  }

  const calculateUpgradeCost = (index: number) => {
    const baseMultiplier = UPGRADE_TYPES[index].costMultiplier
    return 0.001 * Math.pow(baseMultiplier, state.upgradeLevels[index])
  }

  const calculateMiningRate = (index: number) => {
    const baseMultiplier = UPGRADE_TYPES[index].baseMultiplier
    return baseMultiplier * Math.pow(2, state.upgradeLevels[index])
  }

  return (
    <div className="bg-gradient-to-b from-neutral-900 to-neutral-800 rounded-lg shadow-lg">
      <h3 className="text-3xl font-bold mb-6 text-yellow-500">Mining Upgrades</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {UPGRADE_TYPES.map((upgradeType, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            onHoverStart={() => setHoveredUpgrade(index)}
            onHoverEnd={() => setHoveredUpgrade(null)}
          >
            <Card className="bg-neutral-900 border-neutral-700 overflow-hidden">
              <CardHeader className="relative">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-yellow-600 to-yellow-400 opacity-0"
                  animate={{ opacity: hoveredUpgrade === index ? 0.2 : 0 }}
                  transition={{ duration: 0.3 }}
                />
                <CardTitle className="flex items-center space-x-2">
                  <upgradeType.icon className="w-6 h-6 text-yellow-500" />
                  <span>{upgradeType.name}</span>
                </CardTitle>
                <CardDescription>
                  Level: {state.upgradeLevels[index]}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm">Mining Rate: {calculateMiningRate(index).toFixed(4)} BTC/s</p>
                  <p className="text-sm">Upgrade Cost: {calculateUpgradeCost(index).toFixed(6)} BTC</p>
                  <Progress value={(state.balance / calculateUpgradeCost(index)) * 100} className="h-2" />
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={() => upgrade(index)}
                  disabled={state.balance < calculateUpgradeCost(index)}
                  className="w-full bg-yellow-600 hover:bg-yellow-500 transition-all duration-300 transform hover:scale-105"
                >
                  <Bitcoin className="w-4 h-4 mr-2" />
                  Upgrade
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}