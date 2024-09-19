"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { Trophy, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const leaderboardData = [
  { name: "CryptoKing", balance: 1.23456789, avatar: "/avatar1.jpg", rankChange: 0, miningRate: 0.00012345 },
  { name: "BitcoinQueen", balance: 0.98765432, avatar: "/avatar2.jpg", rankChange: 2, miningRate: 0.00010987 },
  { name: "BlockchainWizard", balance: 0.87654321, avatar: "/avatar3.jpg", rankChange: -1, miningRate: 0.00009876 },
  { name: "SatoshiDisciple", balance: 0.76543210, avatar: "/avatar4.jpg", rankChange: 1, miningRate: 0.00008765 },
  { name: "HashMaster", balance: 0.65432109, avatar: "/avatar5.jpg", rankChange: -2, miningRate: 0.00007654 },
  { name: "CryptoNinja", balance: 0.54321098, avatar: "/avatar6.jpg", rankChange: 3, miningRate: 0.00006543 },
  { name: "BlockExplorer", balance: 0.43210987, avatar: "/avatar7.jpg", rankChange: 0, miningRate: 0.00005432 },
  { name: "ChainBreaker", balance: 0.32109876, avatar: "/avatar8.jpg", rankChange: -1, miningRate: 0.00004321 },
  { name: "NodeRunner", balance: 0.21098765, avatar: "/avatar9.jpg", rankChange: 2, miningRate: 0.00003210 },
  { name: "CoinCollector", balance: 0.10987654, avatar: "/avatar10.jpg", rankChange: -3, miningRate: 0.00002109 },
]

const getRankChangeIcon = (change: number) => {
  if (change > 0) return <TrendingUp className="w-3 h-3 text-green-500" />
  if (change < 0) return <TrendingDown className="w-3 h-3 text-red-500" />
  return <Minus className="w-3 h-3 text-neutral-500" />
}

const getTrophyColor = (rank: number) => {
  if (rank === 1) return "text-yellow-400"
  if (rank === 2) return "text-neutral-400"
  if (rank === 3) return "text-amber-600"
  return "text-neutral-700"
}

export default function Leaderboard() {
  return (
    <Card className="bg-neutral-900 border-neutral-800">
      <CardHeader className="p-4">
        <CardTitle className="text-xl font-bold text-white flex items-center">
          Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent className="px-1">
        <div className="space-y-2">
          {leaderboardData.map((user, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              className="flex items-center p-2 rounded-lg bg-neutral-900 hover:bg-neutral-750 transition-colors"
            >
              <div className="flex items-center justify-center w-8 h-8 mr-2">
                {index < 3 ? (
                  <Trophy className={`w-5 h-5 ${getTrophyColor(index + 1)}`} />
                ) : (
                  <span className="text-sm text-neutral-400">{index + 1}</span>
                )}
              </div>
              <Avatar className="w-6 h-6 mr-2">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{user.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-grow min-w-0">
                <p className="font-bold text-white text-[16px] truncate">{user.name}</p>
                <p className="text-xs text-neutral-400 text-[12px] truncate">{user.balance.toFixed(8)} BTC</p>
              </div>
              <div className="flex flex-col items-end ml-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center">
                        <span className="text-xs text-neutral-400 mr-1">{Math.abs(user.rankChange)}</span>
                        {getRankChangeIcon(user.rankChange)}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="left">
                      <p className="text-xs">Rank change</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <p className="text-xs text-neutral-500">{user.miningRate.toFixed(8)}/s</p>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}