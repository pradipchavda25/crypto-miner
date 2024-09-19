import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import CryptoClicker from './CryptoClicker';
import BlockchainPuzzle from './BlockchainPuzzle';
import NFTCollector from './NFTCollector';
import TradingSimulator from './TradingSimulator';

type GameComponentType = React.ComponentType;

interface Game {
  id: string;
  title: string;
  description: string;
  icon: string;
  component: GameComponentType;
  color: string;
}

const games: Game[] = [
  {
    id: 'cryptoClicker',
    title: 'Crypto Clicker',
    description: 'Click to mine cryptocurrencies',
    icon: 'mdi:cursor-default-click',
    component: CryptoClicker,
    color: 'bg-blue-500'
  },
  {
    id: 'blockchainPuzzle',
    title: 'Blockchain Puzzle',
    description: 'Solve puzzles to build the blockchain',
    icon: 'mdi:puzzle',
    component: BlockchainPuzzle,
    color: 'bg-green-500'
  },
  {
    id: 'nftCollector',
    title: 'NFT Collector',
    description: 'Collect and trade unique digital assets',
    icon: 'mdi:image-multiple',
    component: NFTCollector,
    color: 'bg-purple-500'
  },
  {
    id: 'tradingSimulator',
    title: 'Trading Simulator',
    description: 'Experience the thrill of crypto trading',
    icon: 'mdi:trending-up',
    component: TradingSimulator,
    color: 'bg-orange-500'
  },
];

interface GameCardProps {
  game: Game;
  onClick: () => void;
}

const GameCard: React.FC<GameCardProps> = ({ game, onClick }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    <Card 
      className="bg-neutral-800 hover:bg-neutral-700 transition-colors cursor-pointer h-full flex flex-col"
      onClick={onClick}
    >
      <CardHeader>
        <div className={`${game.color} w-12 h-12 rounded-full flex items-center justify-center mb-2`}>
          <Icon icon={game.icon} className="text-white text-2xl" />
        </div>
        <CardTitle className="text-xl font-bold text-white">{game.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-neutral-400">{game.description}</p>
      </CardContent>
      <div className="p-4">
        <Badge variant="secondary" className='bg-white text-black p-2 px-3'>Play Now</Badge>
      </div>
    </Card>
  </motion.div>
);

const GamesSection: React.FC = () => {
  const [activeGame, setActiveGame] = useState<Game | null>(null);

  return (
    <div className="py-6 bg-neutral-900 rounded-lg">
      <h2 className="text-3xl font-bold text-white mb-6">Crypto Arcade</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {games.map((game) => (
          <GameCard key={game.id} game={game} onClick={() => setActiveGame(game)} />
        ))}
      </div>
      <Dialog open={activeGame !== null} onOpenChange={() => setActiveGame(null)}>
        <DialogContent className="bg-neutral-900 rounded-xl text-white max-w-4xl w-11/12 h-5/6">
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle className="text-2xl font-bold flex items-center">
              {activeGame && (
                <>
                  <Icon icon={activeGame.icon} className={`${activeGame.color} rounded-full p-1 mr-2 text-white`} />
                  {activeGame.title}
                </>
              )}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto">
            {activeGame && <activeGame.component />}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GamesSection;