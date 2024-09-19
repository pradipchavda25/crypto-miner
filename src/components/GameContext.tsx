// import React, { createContext, useContext, useReducer, useEffect } from 'react'

// const MINING_RATE = 0.00001
// const XP_PER_MINE = 1
// const ENERGY_CONSUMPTION_RATE = 0.1 // kW per mining operation

// type UpgradeType = {
//   name: string
//   baseMultiplier: number
//   costMultiplier: number
// }

// const UPGRADE_TYPES: UpgradeType[] = [
//   { name: 'CPU Miner', baseMultiplier: 2, costMultiplier: 1.5 },
//   { name: 'GPU Rig', baseMultiplier: 5, costMultiplier: 2 },
//   { name: 'ASIC Miner', baseMultiplier: 10, costMultiplier: 3 },
//   { name: 'Mining Farm', baseMultiplier: 20, costMultiplier: 5 },
// ]

// type State = {
//   balance: number
//   miningRate: number
//   upgradeLevels: number[]
//   level: number
//   experience: number
//   totalMined: number
//   achievements: string[]
//   energy: number
//   lastActiveTimestamp: number
// }

// type Action =
//   | { type: 'MINE' }
//   | { type: 'MINE_PASSIVE'; payload: number }
//   | { type: 'UPGRADE'; payload: number }
//   | { type: 'UNLOCK_ACHIEVEMENT'; payload: string }
//   | { type: 'UPDATE_LAST_ACTIVE' }
//   | { type: 'REGENERATE_ENERGY' }

// const initialState: State = {
//   balance: 0.001,
//   miningRate: MINING_RATE,
//   upgradeLevels: Array(UPGRADE_TYPES.length).fill(0),
//   level: 1,
//   experience: 0,
//   totalMined: 0,
//   achievements: [],
//   energy: 1000,
//   lastActiveTimestamp: Date.now(),
// }

// function calculateMiningRate(upgradeLevels: number[]): number {
//   return MINING_RATE * upgradeLevels.reduce((acc, level, index) => {
//     return acc * Math.pow(UPGRADE_TYPES[index].baseMultiplier, level)
//   }, 1)
// }

// function gameReducer(state: State, action: Action): State {
//   switch (action.type) {
//     case 'MINE':
//       if (state.energy < ENERGY_CONSUMPTION_RATE) return state
//       const minedAmount = state.miningRate
//       const newExperience = state.experience + XP_PER_MINE
//       const newLevel = Math.floor(newExperience / 100) + 1
//       const newEnergy = Math.max(0, state.energy - ENERGY_CONSUMPTION_RATE)
//       return {
//         ...state,
//         balance: state.balance + minedAmount,
//         totalMined: state.totalMined + minedAmount,
//         experience: newExperience % 100,
//         level: newLevel,
//         energy: newEnergy,
//         lastActiveTimestamp: Date.now(),
//       }
//     case 'MINE_PASSIVE':
//       const passiveMinedAmount = state.miningRate * action.payload
//       return {
//         ...state,
//         balance: state.balance + passiveMinedAmount,
//         totalMined: state.totalMined + passiveMinedAmount,
//         lastActiveTimestamp: Date.now(),
//       }
//     case 'UPGRADE':
//       const upgradeCost = 0.001 * Math.pow(UPGRADE_TYPES[action.payload].costMultiplier, state.upgradeLevels[action.payload])
//       if (state.balance < upgradeCost) return state
//       const newUpgradeLevels = [...state.upgradeLevels]
//       newUpgradeLevels[action.payload]++
//       const newMiningRate = calculateMiningRate(newUpgradeLevels)
//       return {
//         ...state,
//         balance: state.balance - upgradeCost,
//         miningRate: newMiningRate,
//         upgradeLevels: newUpgradeLevels,
//         lastActiveTimestamp: Date.now(),
//       }
//     case 'UNLOCK_ACHIEVEMENT':
//       if (!state.achievements.includes(action.payload)) {
//         return { ...state, achievements: [...state.achievements, action.payload], lastActiveTimestamp: Date.now() }
//       }
//       return state
//     case 'UPDATE_LAST_ACTIVE':
//       return { ...state, lastActiveTimestamp: Date.now() }
//     case 'REGENERATE_ENERGY':
//       return { ...state, energy: Math.min(1000, state.energy + 1), lastActiveTimestamp: Date.now() }
//     default:
//       return state
//   }
// }

// const GameContext = createContext<{
//   state: State
//   dispatch: React.Dispatch<Action>
// } | undefined>(undefined)

// export function GameProvider({ children }: { children: React.ReactNode }) {
//   const [state, dispatch] = useReducer(gameReducer, initialState)

//   useEffect(() => {
//     const timer = setInterval(() => {
//       const now = Date.now()
//       const secondsSinceLastActive = (now - state.lastActiveTimestamp) / 1000
//       if (secondsSinceLastActive > 0) {
//         dispatch({ type: 'MINE_PASSIVE', payload: secondsSinceLastActive })
//       }
//     }, 1000)

//     return () => clearInterval(timer)
//   }, [state.lastActiveTimestamp])

//   useEffect(() => {
//     const energyTimer = setInterval(() => {
//       if (state.energy < 1000) {
//         dispatch({ type: 'REGENERATE_ENERGY' })
//       }
//     }, 10000) // Regenerate 1 energy every 10 seconds

//     return () => clearInterval(energyTimer)
//   }, [state.energy])

//   return <GameContext.Provider value={{ state, dispatch }}>{children}</GameContext.Provider>
// }

// export function useGameContext() {
//   const context = useContext(GameContext)
//   if (context === undefined) {
//     throw new Error('useGameContext must be used within a GameProvider')
//   }
//   return context
// }

import React, { createContext, useContext, useReducer, useEffect } from 'react'

const MINING_RATE = 0.00001
const XP_PER_MINE = 1
const ENERGY_CONSUMPTION_RATE = 0.1 // kW per mining operation

type UpgradeType = {
  name: string
  baseMultiplier: number
  costMultiplier: number
  description: string
  requiredLevel: number
}

const UPGRADE_TYPES: UpgradeType[] = [
  { name: 'CPU Miner', baseMultiplier: 2, costMultiplier: 1.5, description: 'Boost your mining power with CPU optimization', requiredLevel: 1 },
  { name: 'GPU Rig', baseMultiplier: 5, costMultiplier: 2, description: 'Harness the power of GPUs for faster mining', requiredLevel: 5 },
  { name: 'ASIC Miner', baseMultiplier: 10, costMultiplier: 3, description: 'Specialized hardware for maximum efficiency', requiredLevel: 10 },
  { name: 'Quantum Computer', baseMultiplier: 20, costMultiplier: 5, description: 'Utilize quantum supremacy for unparalleled mining speed', requiredLevel: 20 },
  { name: 'Dyson Sphere', baseMultiplier: 50, costMultiplier: 10, description: 'Harness the power of an entire star for mining', requiredLevel: 50 },
]

type State = {
  balance: number
  miningRate: number
  upgradeLevels: number[]
  level: number
  experience: number
  totalMined: number
  achievements: string[]
  energy: number
  lastActiveTimestamp: number
  clickerHighScore: number
}

type Action =
  | { type: 'MINE' }
  | { type: 'MINE_PASSIVE'; payload: number }
  | { type: 'UPGRADE'; payload: number }
  | { type: 'UNLOCK_ACHIEVEMENT'; payload: string }
  | { type: 'UPDATE_LAST_ACTIVE' }
  | { type: 'REGENERATE_ENERGY' }
  | { type: 'UPDATE_CLICKER_HIGH_SCORE'; payload: number }

const initialState: State = {
  balance: 0.001,
  miningRate: MINING_RATE,
  upgradeLevels: Array(UPGRADE_TYPES.length).fill(0),
  level: 1,
  experience: 0,
  totalMined: 0,
  achievements: [],
  energy: 1000,
  lastActiveTimestamp: Date.now(),
  clickerHighScore: 0,
}

function calculateMiningRate(upgradeLevels: number[]): number {
  return MINING_RATE * upgradeLevels.reduce((acc, level, index) => {
    return acc * Math.pow(UPGRADE_TYPES[index].baseMultiplier, level)
  }, 1)
}

function gameReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'MINE':
      if (state.energy < ENERGY_CONSUMPTION_RATE) return state
      const minedAmount = state.miningRate
      const newExperience = state.experience + XP_PER_MINE
      const newLevel = Math.floor(newExperience / 100) + 1
      const newEnergy = Math.max(0, state.energy - ENERGY_CONSUMPTION_RATE)
      return {
        ...state,
        balance: state.balance + minedAmount,
        totalMined: state.totalMined + minedAmount,
        experience: newExperience % 100,
        level: newLevel,
        energy: newEnergy,
        lastActiveTimestamp: Date.now(),
      }
    case 'MINE_PASSIVE':
      const passiveMinedAmount = state.miningRate * action.payload
      return {
        ...state,
        balance: state.balance + passiveMinedAmount,
        totalMined: state.totalMined + passiveMinedAmount,
        lastActiveTimestamp: Date.now(),
      }
    case 'UPGRADE':
      const upgradeCost = 0.001 * Math.pow(UPGRADE_TYPES[action.payload].costMultiplier, state.upgradeLevels[action.payload])
      if (state.balance < upgradeCost || state.level < UPGRADE_TYPES[action.payload].requiredLevel) return state
      const newUpgradeLevels = [...state.upgradeLevels]
      newUpgradeLevels[action.payload]++
      const newMiningRate = calculateMiningRate(newUpgradeLevels)
      return {
        ...state,
        balance: state.balance - upgradeCost,
        miningRate: newMiningRate,
        upgradeLevels: newUpgradeLevels,
        lastActiveTimestamp: Date.now(),
      }
    case 'UNLOCK_ACHIEVEMENT':
      if (!state.achievements.includes(action.payload)) {
        return { ...state, achievements: [...state.achievements, action.payload], lastActiveTimestamp: Date.now() }
      }
      return state
    case 'UPDATE_LAST_ACTIVE':
      return { ...state, lastActiveTimestamp: Date.now() }
    case 'REGENERATE_ENERGY':
      return { ...state, energy: Math.min(1000, state.energy + 1), lastActiveTimestamp: Date.now() }
    case 'UPDATE_CLICKER_HIGH_SCORE':
      if (action.payload > state.clickerHighScore) {
        return { ...state, clickerHighScore: action.payload }
      }
      return state
    default:
      return state
  }
}

const GameContext = createContext<{
  state: State
  dispatch: React.Dispatch<Action>
} | undefined>(undefined)

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState)

  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now()
      const secondsSinceLastActive = (now - state.lastActiveTimestamp) / 1000
      if (secondsSinceLastActive > 0) {
        dispatch({ type: 'MINE_PASSIVE', payload: secondsSinceLastActive })
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [state.lastActiveTimestamp])

  useEffect(() => {
    const energyTimer = setInterval(() => {
      if (state.energy < 1000) {
        dispatch({ type: 'REGENERATE_ENERGY' })
      }
    }, 10000) // Regenerate 1 energy every 10 seconds

    return () => clearInterval(energyTimer)
  }, [state.energy])

  return <GameContext.Provider value={{ state, dispatch }}>{children}</GameContext.Provider>
}

export function useGameContext() {
  const context = useContext(GameContext)
  if (context === undefined) {
    throw new Error('useGameContext must be used within a GameProvider')
  }
  return context
}