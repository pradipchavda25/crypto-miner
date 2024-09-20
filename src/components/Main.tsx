import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap,
  Trophy, TrendingUp,
  Home, User
} from "lucide-react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import Header from "./Header";
import MiningStation from "./MiningStation";
import Upgrades from "./Upgrades";
import Leaderboard from "./Leaderboard";
import Profile from "./Profile";
import MarketTrends from "./MarketTrends";
import { GameProvider, useGameContext } from "./GameContext";
import AppLoader from "./AppLoader";
import GamesSection from "./games/MainGameSection";

function CryptoMinerApp() {
  const { state, dispatch } = useGameContext();
  const [activeTab, setActiveTab] = useState("home");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const timer = setInterval(() => {
      dispatch({ type: "MINE_PASSIVE", payload: 1 });
    }, 1000);
    return () => clearInterval(timer);
  }, [dispatch]);

  if (isLoading) {
    return <AppLoader onLoadingComplete={() => setIsLoading(false)} />;
  }

  return (
    <div className="flex flex-col h-screen bg-neutral-900 text-white">
      <Header />
      <main className="flex-grow overflow-hidden relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="h-full"
          >
            <Tabs value={activeTab} className="h-full">
              <TabsContent value="home" className="h-full">
                <ScrollArea className="h-full p-4">
                  <MiningStation />
                  <GamesSection />
                  <MarketTrends />
                </ScrollArea>
              </TabsContent>
              <TabsContent value="upgrades" className="h-full">
                <ScrollArea className="h-full p-4">
                  <Upgrades />
                </ScrollArea>
              </TabsContent>
              <TabsContent value="leaderboard" className="h-full">
                <ScrollArea className="h-full p-4">
                  <Leaderboard />
                </ScrollArea>
              </TabsContent>
              <TabsContent value="market" className="h-full">
                <ScrollArea className="h-full p-4">
                  <MarketTrends />
                </ScrollArea>
              </TabsContent>
              <TabsContent value="profile" className="h-full">
                <ScrollArea className="h-full p-4">
                  <Profile />
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </motion.div>
        </AnimatePresence>
        <BackgroundGraphicsGrid />
      </main>
      <AnimatedNavBar activeTab={activeTab} setActiveTab={setActiveTab} />
      <Toaster />
    </div>
  );
}

function BackgroundGraphicsGrid() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <svg
        className="absolute w-full h-full opacity-10"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
      >
        <defs>
          <pattern
            id="grid"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="#4a4a4a"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </div>
  );
}

function AnimatedNavBar({
  activeTab,
  setActiveTab,
}: {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}) {
  const tabs = [
    { value: "home", icon: Home, label: "Home" },
    { value: "upgrades", icon: Zap, label: "Upgrades" },
    { value: "market", icon: TrendingUp, label: "Market" },
    { value: "leaderboard", icon: Trophy, label: "Leaderboard" },
    { value: "profile", icon: User, label: "Profile" },
  ];

  return (
    <motion.footer
      className="bg-neutral-900 text-white px-4 py-3 border-t border-neutral-700 rounded-full shadow-lg"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="flex justify-between items-center">
        {tabs.map((tab) => (
          <motion.button
            key={tab.value}
            className={`flex items-center space-x-2 p-3 ${
              activeTab === tab.value
                ? "bg-yellow-500 text-neutral-900 rounded-full"
                : ""
            }`}
            onClick={() => setActiveTab(tab.value)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            <tab.icon className="w-5 h-5" />
            <span className="sr-only">{tab.label}</span>
          </motion.button>
        ))}
      </div>
    </motion.footer>
  );
}

export default function CryptoMiner() {
  return (
    <GameProvider>
      <CryptoMinerApp />
    </GameProvider>
  );
}
