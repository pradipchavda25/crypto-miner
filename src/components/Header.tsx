"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { Bitcoin, ChevronDown, Cpu, Zap, User, Wallet, Award } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useGameContext } from './GameContext'
import useTelegram from '@/context/TelegramContext'

export default function Header() {
  const { state } = useGameContext()
  const { user } = useTelegram()

  const formatNumber = (num: number) => {
    if (isNaN(num)) return '0.00'
    if (num >= 1e6) return (num / 1e6).toFixed(10) + 'M'
    if (num >= 1e3) return (num / 1e3).toFixed(10) + 'K'
    return num.toFixed(10)
  }

  return (
    <motion.header
      className="flex justify-between items-center p-3 bg-gradient-to-r from-neutral-900 to-neutral-800 shadow-lg"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="p-1 ">
            <Avatar className="h-10 w-10 border-2 bg-black border-neutral-800">
              <AvatarImage className='bg-neutral-900' src={user?.photo_url} />
              <AvatarFallback className='bg-neutral-900 font-semibold'>{user?.first_name ? user.first_name[0] : 'A'}</AvatarFallback>
            </Avatar>
            <span className="ml-2 font-semibold text-sm hidden sm:inline-block">
              {user?.first_name || "Anonymous"}
            </span>
            <ChevronDown className="ml-1 h-4 w-4 text-neutral-400" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-64 bg-neutral-800 border-neutral-700">
          <DropdownMenuLabel>
            <h2 className="font-bold text-lg text-white">
              {user ? `${user.first_name} ${user.last_name || ''}` : "Anonymous"}
            </h2>
            <div className="flex items-center space-x-2 mt-1">
              <Badge variant="secondary" className="text-xs bg-yellow-500 text-neutral-900">
                Level {state.level}
              </Badge>
              <Progress value={(state.experience / (state.level * 100)) * 100} className="w-20 h-2" />
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-neutral-700" />
          <DropdownMenuItem className="flex items-center py-2 hover:bg-neutral-700">
            <Cpu className="w-4 h-4 text-blue-400 mr-2" />
            <span className="text-sm font-medium">Mining Rate: {formatNumber(state.miningRate)}/s</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex items-center py-2 hover:bg-neutral-700">
            <Zap className="w-4 h-4 text-yellow-400 mr-2" />
            <span className="text-sm font-medium">Energy: {formatNumber(state.energy)}</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex items-center py-2 hover:bg-neutral-700">
            <Award className="w-4 h-4 text-purple-400 mr-2" />
            <span className="text-sm font-medium">Achievements: {state.achievements.length}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <motion.div
        className="flex items-center bg-neutral-700 rounded-full px-3 py-2"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Bitcoin className="w-5 h-5 mr-2 text-yellow-500" />
        <motion.span
          key={state.balance}
          className="font-bold text-sm"
          initial={{ scale: 1.2, color: "#22c55e" }}
          animate={{ scale: 1, color: "#e2e8f0" }}
          transition={{ duration: 0.3 }}
        >
          {formatNumber(state.balance)}
        </motion.span>
        <span className="ml-1 text-xs text-neutral-400">BTC</span>
      </motion.div>
    </motion.header>
  )
}