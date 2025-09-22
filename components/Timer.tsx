import React, { useState, useEffect, useContext } from 'react';
import { LanguageContext } from '../App';
import { PlayIcon, PauseIcon } from './Icons';

interface TimerProps {
  isRunning: boolean;
  isPaused: boolean;
  onPauseToggle: () => void;
}

const Timer: React.FC<TimerProps> = ({ isRunning, isPaused, onPauseToggle }) => {
  const [time, setTime] = useState(0);
  const context = useContext(LanguageContext);
  if (!context) return null;
  const { t } = context;

  useEffect(() => {
    // Fix: Use 'number' for interval ID type in browser environments instead of 'NodeJS.Timeout'.
    let interval: number | null = null;
    if (isRunning && !isPaused) {
      interval = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, isPaused]);

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  return (
    <div className="flex items-center gap-4 bg-white dark:bg-gray-700 p-3 rounded-lg shadow-md">
      <span className="font-mono text-2xl text-gray-800 dark:text-gray-100 w-24 text-center">{formatTime(time)}</span>
      <button 
        onClick={onPauseToggle}
        className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        aria-label={isPaused ? t('resume') : t('pause')}
      >
        {isPaused ? <PlayIcon /> : <PauseIcon />}
      </button>
    </div>
  );
};

export default Timer;