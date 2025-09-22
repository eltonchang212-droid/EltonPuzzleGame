
import React, { useState, useContext } from 'react';
import { LanguageContext } from '../App';
import { GameMode, PuzzleOptions } from '../types';

interface GameOptionsProps {
  image: string;
  onStartGame: (options: PuzzleOptions) => void;
}

const GameOptions: React.FC<GameOptionsProps> = ({ image, onStartGame }) => {
  const context = useContext(LanguageContext);
  const [mode, setMode] = useState<GameMode>(GameMode.TRADITIONAL);
  const [gridSize, setGridSize] = useState(3);
  const [timerEnabled, setTimerEnabled] = useState(true);

  if (!context) return null;
  const { t } = context;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStartGame({ mode, gridSize, timerEnabled });
  };

  const difficultyOptions = mode === GameMode.TRADITIONAL
    ? [3, 4, 5, 6, 7, 8, 9]
    : [3, 4];

  return (
    <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-8 items-center md:items-start">
      <div className="w-full md:w-1/2">
        <img src={image} alt="Selected Puzzle" className="rounded-xl shadow-2xl w-full object-contain" />
      </div>
      <div className="w-full md:w-1/2 bg-white dark:bg-gray-900 p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">{t('gameOptions')}</h2>
        <form onSubmit={handleSubmit}>
          {/* Game Mode */}
          <div className="mb-6">
            <label className="block text-lg font-semibold mb-2">{t('gameMode')}</label>
            <div className="flex gap-4">
              <button type="button" onClick={() => { setMode(GameMode.TRADITIONAL); setGridSize(3); }} className={`flex-1 py-2 rounded-lg transition-colors ${mode === GameMode.TRADITIONAL ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>{t('traditional')}</button>
              <button type="button" onClick={() => { setMode(GameMode.SLIDING); setGridSize(3); }} className={`flex-1 py-2 rounded-lg transition-colors ${mode === GameMode.SLIDING ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>{t('sliding')}</button>
            </div>
          </div>

          {/* Difficulty */}
          <div className="mb-6">
            <label className="block text-lg font-semibold mb-2">{t('difficulty')}</label>
             <div className="grid grid-cols-4 gap-2">
                {difficultyOptions.map(size => (
                  <button type="button" key={size} onClick={() => setGridSize(size)} className={`py-2 rounded-lg transition-colors ${gridSize === size ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>
                    {`${size}x${size}`}
                  </button>
                ))}
            </div>
          </div>

          {/* Timer */}
          <div className="mb-8">
             <label className="block text-lg font-semibold mb-2">{t('timer')}</label>
             <label className="flex items-center cursor-pointer">
                <div className="relative">
                    <input type="checkbox" className="sr-only" checked={timerEnabled} onChange={() => setTimerEnabled(!timerEnabled)} />
                    <div className="block bg-gray-600 w-14 h-8 rounded-full"></div>
                    <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${timerEnabled ? 'transform translate-x-full bg-green-400' : ''}`}></div>
                </div>
                <div className="ml-3 text-gray-700 dark:text-gray-300 font-medium">
                    {t('enableTimer')}
                </div>
            </label>
          </div>
          
          <button type="submit" className="w-full py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1">
            {t('startGame')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default GameOptions;
