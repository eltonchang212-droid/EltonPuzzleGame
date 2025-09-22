
import React, { useState, useCallback, useMemo } from 'react';
import { GameState, GameMode, Language, PuzzleOptions } from './types';
import { TRANSLATIONS } from './constants';
import ImageSelector from './components/ImageSelector';
import GameOptions from './components/GameOptions';
import TraditionalPuzzle from './components/TraditionalPuzzle';
import SlidingPuzzle from './components/SlidingPuzzle';
import Header from './components/Header';
import Modal from './components/Modal';

type LanguageContextType = {
  language: Language;
  setLanguage: React.Dispatch<React.SetStateAction<Language>>;
  t: (key: keyof typeof TRANSLATIONS.en) => string;
};

export const LanguageContext = React.createContext<LanguageContextType | null>(null);

function App() {
  const [gameState, setGameState] = useState<GameState>(GameState.SELECTING_IMAGE);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [puzzleOptions, setPuzzleOptions] = useState<PuzzleOptions | null>(null);
  const [language, setLanguage] = useState<Language>(Language.ZH);

  const t = useCallback((key: keyof typeof TRANSLATIONS.en) => {
    return TRANSLATIONS[language][key] || TRANSLATIONS.en[key];
  }, [language]);
  
  const languageContextValue = useMemo(() => ({ language, setLanguage, t }), [language, t]);

  const handleImageSelect = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setGameState(GameState.SELECTING_OPTIONS);
  };

  const handleStartGame = (options: PuzzleOptions) => {
    setPuzzleOptions(options);
    setGameState(GameState.PLAYING);
  };

  const handleGameComplete = () => {
    setGameState(GameState.COMPLETED);
  };

  const handlePlayAgain = () => {
    setGameState(GameState.SELECTING_IMAGE);
    setSelectedImage(null);
    setPuzzleOptions(null);
  };

  const renderGameState = () => {
    switch (gameState) {
      case GameState.SELECTING_IMAGE:
        return <ImageSelector onImageSelect={handleImageSelect} />;
      case GameState.SELECTING_OPTIONS:
        if (selectedImage) {
          return <GameOptions image={selectedImage} onStartGame={handleStartGame} />;
        }
        // Fallback if image is somehow null
        return <ImageSelector onImageSelect={handleImageSelect} />;
      case GameState.PLAYING:
        if (selectedImage && puzzleOptions) {
            return puzzleOptions.mode === GameMode.TRADITIONAL ? (
                <TraditionalPuzzle imageSrc={selectedImage} options={puzzleOptions} onComplete={handleGameComplete} onExit={handlePlayAgain} />
            ) : (
                <SlidingPuzzle imageSrc={selectedImage} options={puzzleOptions} onComplete={handleGameComplete} onExit={handlePlayAgain} />
            );
        }
        return null; // Should not happen
      case GameState.COMPLETED:
          return (
             <div className="flex items-center justify-center h-screen">
                <Modal isOpen={true} onClose={handlePlayAgain} title={t('congratulations')}>
                    <div className="text-center text-gray-700 dark:text-gray-300">
                      <p className="mb-6">{t('puzzleCompleted')}</p>
                      <button
                        onClick={handlePlayAgain}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        {t('playAgain')}
                      </button>
                    </div>
                </Modal>
             </div>
          )
      default:
        return null;
    }
  };

  return (
    <LanguageContext.Provider value={languageContextValue}>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-sans">
        <Header />
        <main className="p-4 sm:p-6 md:p-8">
            {renderGameState()}
        </main>
      </div>
    </LanguageContext.Provider>
  );
}

export default App;
