"use client"

import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useGameContext } from './GameContext'
import { Trophy, Zap, Coins, TrendingUp, Target } from 'lucide-react'
import useTelegram from '@/context/TelegramContext'

// Define the GameState interface
interface GameState {
  totalMined: number;
  upgradeLevels: number[];
  balance: number;
  miningRate: number;
  level: number;
  experience: number;
  energy: number;
  achievements: string[];
}

// Define the Achievement interface
interface Achievement {
  name: string;
  description: string;
  icon: React.FC<{ className?: string }>;
  condition: (state: GameState) => boolean;
}

const achievements: Achievement[] = [
  { name: "First Million", description: "Mine your first 0.00000001 BTC", icon: Coins, condition: (state) => state.totalMined >= 0.00000001 },
  { name: "Upgrade Master", description: "Purchase all upgrades", icon: Zap, condition: (state) => state.upgradeLevels.every(level => level > 0) },
  { name: "Crypto Tycoon", description: "Reach 1 BTC balance", icon: Trophy, condition: (state) => state.balance >= 1 },
  { name: "Speed Demon", description: "Reach a mining rate of 0.001 BTC/click", icon: TrendingUp, condition: (state) => state.miningRate >= 0.001 },
  { name: "Dedicated Miner", description: "Reach level 10", icon: Target, condition: (state) => state.level >= 10 },
]

export default function Profile() {
  const { state, dispatch } = useGameContext()
  const { webApp, user } = useTelegram();
  console.log('webApp', webApp, user);
  
  useEffect(() => {
    achievements.forEach(achievement => {
      if (achievement.condition(state)) {
        dispatch({ type: 'UNLOCK_ACHIEVEMENT', payload: achievement.name })
      }
    })
  }, [state, dispatch])

  const formatNumber = (num: number) => {
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M'
    if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K'
    return num.toFixed(2)
  }


  return (
    <div className="space-y-4 p-0">
      <Card className="bg-neutral-900 border-neutral-700">
        <CardHeader className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Avatar className="w-24 h-24 sm:w-32 sm:h-32">
            <AvatarImage src="/placeholder-avatar.jpg" />
            <AvatarFallback>{user?.first_name ? user.first_name[0] : 'A'}</AvatarFallback>
          </Avatar>
          <div className="text-center sm:text-left">
            <CardTitle className="text-2xl sm:text-3xl mb-2"> {user ? `${user.first_name} ${user.last_name || ''}` : "Anonymous"}</CardTitle>
            <p className="text-sm text-neutral-400">Joined 30 days ago</p>
            <div className="mt-2">
              <Badge variant="secondary" className="mr-2">Level {state.level}</Badge>
              <Badge variant="outline">{formatNumber(state.totalMined)} BTC Mined</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div>
              <p className="text-sm text-neutral-400 mb-1">Experience</p>
              <Progress value={(state.experience / (state.level * 100)) * 100} className="h-2" />
              <p className="text-xs text-neutral-500 mt-1">
                {state.experience} / {state.level * 100} XP
              </p>
            </div>
            <div>
              <p className="text-sm text-neutral-400 mb-1">Mining Rate</p>
              <p className="text-xl font-bold">{state.miningRate.toFixed(8)} BTC/click</p>
            </div>
            <div>
              <p className="text-sm text-neutral-400 mb-1">Balance</p>
              <p className="text-xl font-bold">{state.balance.toFixed(8)} BTC</p>
            </div>
            <div>
              <p className="text-sm text-neutral-400 mb-1">Energy</p>
              <Progress value={(state.energy / 1000) * 100} className="h-2" />
              <p className="text-xs text-neutral-500 mt-1">
                {state.energy} / 1000
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-neutral-900 border-neutral-700">
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <Trophy className="w-5 h-5 mr-2" />
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {achievements.map((achievement, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-center p-3 bg-neutral-800 rounded-lg"
              >
                <div className={`mr-4 p-2 rounded-full ${state.achievements.includes(achievement.name) ? 'bg-green-500' : 'bg-neutral-700'}`}>
                  <achievement.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-grow">
                  <p className="font-bold text-sm">{achievement.name}</p>
                  <p className="text-xs text-neutral-400">{achievement.description}</p>
                </div>
                {state.achievements.includes(achievement.name) && (
                  <Badge variant="secondary" className="ml-2">Unlocked</Badge>
                )}
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}