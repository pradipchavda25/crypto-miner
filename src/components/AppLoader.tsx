import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bitcoin } from 'lucide-react';


interface AppLoaderProps {
    onLoadingComplete: () => void;
  }
  
  const AppLoader: React.FC<AppLoaderProps> = ({ onLoadingComplete }) => {
    const [progress, setProgress] = useState(0);
  
    useEffect(() => {
      const interval = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress >= 100) {
            clearInterval(interval);
            onLoadingComplete();
            return 100;
          }
          return prevProgress + (100 / 60); // Increase by ~1.67% every 33ms to reach 100% in 2 seconds
        });
      }, 33); 
  
      return () => clearInterval(interval);
    }, [onLoadingComplete]);

  return (
    <div className="fixed inset-0 bg-neutral-900 flex flex-col items-center justify-center">
      <motion.div
      >
        <Bitcoin size={64} className="text-yellow-500" />
      </motion.div>
      <h1 className="text-2xl font-bold mt-4 mb-8 text-white">CryptoMiner</h1>
      <div className="w-64 h-2 bg-neutral-700 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-yellow-500"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
        />
      </div>
      <p className="mt-4 text-neutral-400">{Math.round(progress)}%</p>
    </div>
  );
};

export default AppLoader;