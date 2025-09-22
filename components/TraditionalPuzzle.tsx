import React, { useState, useEffect, useMemo, useCallback, useContext } from 'react';
import { PuzzleOptions, TraditionalPiece } from '../types';
import Timer from './Timer';
import { LanguageContext } from '../App';
import Modal from './Modal';
// Fix: Import TRANSLATIONS to resolve type errors for translation keys.
import { TRANSLATIONS } from '../constants';

interface TraditionalPuzzleProps {
  imageSrc: string;
  options: PuzzleOptions;
  onComplete: () => void;
  onExit: () => void;
}

// Helper to shuffle array
const shuffleArray = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

const TraditionalPuzzle: React.FC<TraditionalPuzzleProps> = ({ imageSrc, options, onComplete, onExit }) => {
  const { gridSize, timerEnabled } = options;
  const [pieces, setPieces] = useState<TraditionalPiece[]>([]);
  const [boardState, setBoardState] = useState<(TraditionalPiece | null)[]>([]);
  const [trayPieces, setTrayPieces] = useState<TraditionalPiece[]>([]);
  const [selectedPiece, setSelectedPiece] = useState<TraditionalPiece | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [notification, setNotification] = useState<string>('');
  
  const context = useContext(LanguageContext);
  if (!context) return null;
  const { t } = context;

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageSrc;
    img.onload = () => {
      const pieceWidth = img.width / gridSize;
      const pieceHeight = img.height / gridSize;
      const generatedPieces: TraditionalPiece[] = [];
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = pieceWidth;
      canvas.height = pieceHeight;

      for (let i = 0; i < gridSize * gridSize; i++) {
        const row = Math.floor(i / gridSize);
        const col = i % gridSize;
        ctx?.clearRect(0, 0, pieceWidth, pieceHeight);
        ctx?.drawImage(img, col * pieceWidth, row * pieceHeight, pieceWidth, pieceHeight, 0, 0, pieceWidth, pieceHeight);
        generatedPieces.push({
          id: i,
          imgUrl: canvas.toDataURL(),
          width: pieceWidth,
          height: pieceHeight,
          correctIndex: i,
        });
      }
      setPieces(generatedPieces);
      setTrayPieces(shuffleArray(generatedPieces));
      setBoardState(Array(gridSize * gridSize).fill(null));
    };
  }, [imageSrc, gridSize]);

  useEffect(() => {
    if (pieces.length > 0 && boardState.every(p => p !== null)) {
      const isCorrect = boardState.every((p, index) => p?.correctIndex === index);
      if (isCorrect) {
        onComplete();
      }
    }
  }, [boardState, pieces, onComplete]);

  const showNotification = (messageKey: keyof typeof TRANSLATIONS.en) => {
    setNotification(t(messageKey));
    setTimeout(() => setNotification(''), 2000);
  };

  const handleSelectTrayPiece = (piece: TraditionalPiece) => {
    if(isPaused) return;
    setSelectedPiece(piece);
  };

  const handlePlaceOnBoard = (index: number) => {
    if (isPaused) return;
    if (!selectedPiece) {
      showNotification('selectAPiece');
      return;
    }
    if (boardState[index] !== null) return; 

    if (selectedPiece.correctIndex === index) {
      const newBoardState = [...boardState];
      newBoardState[index] = selectedPiece;
      setBoardState(newBoardState);
      setTrayPieces(trayPieces.filter(p => p.id !== selectedPiece.id));
      setSelectedPiece(null);
    } else {
      showNotification('incorrectPlacement');
    }
  };
  
  const handleUnplaceFromBoard = (index: number) => {
      if (isPaused) return;
      const pieceToUnplace = boardState[index];
      if (!pieceToUnplace) return;

      const newBoardState = [...boardState];
      newBoardState[index] = null;
      setBoardState(newBoardState);

      setTrayPieces(shuffleArray([...trayPieces, pieceToUnplace]));
  };

  const boardAspectRatio = pieces.length > 0 ? pieces[0].width / pieces[0].height : 1;
  const boardWidth = 600; // max width
  const boardHeight = boardWidth / (boardAspectRatio * gridSize) * gridSize;

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex w-full justify-between items-start">
        <button onClick={onExit} className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors">← {t('playAgain')}</button>
        {timerEnabled && <Timer isRunning={true} isPaused={isPaused} onPauseToggle={() => setIsPaused(!isPaused)} />}
      </div>

      <div className="relative w-full max-w-2xl mx-auto">
        <div 
            className="grid gap-1 bg-gray-300 dark:bg-gray-700 p-2 rounded-lg shadow-inner"
            style={{
                gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                aspectRatio: `${pieces[0]?.width ? pieces[0].width * gridSize : 1} / ${pieces[0]?.height ? pieces[0].height * gridSize : 1}`
            }}
        >
            {boardState.map((piece, index) => (
                <div
                    key={index}
                    onClick={() => piece ? handleUnplaceFromBoard(index) : handlePlaceOnBoard(index)}
                    className="flex items-center justify-center bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400 text-2xl font-bold cursor-pointer transition-all duration-300"
                >
                    {piece ? (
                        <img src={piece.imgUrl} alt={`piece ${piece.id}`} className="w-full h-full object-cover" />
                    ) : (
                        <span>{index + 1}</span>
                    )}
                </div>
            ))}
        </div>
         {isPaused && (
            <Modal isOpen={isPaused} onClose={() => setIsPaused(false)} title={t('gamePaused')}>
              <p className="text-center text-gray-700 dark:text-gray-300">{t('resumeGame')}</p>
            </Modal>
         )}
         {notification && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg animate-pulse">
                {notification}
            </div>
         )}
      </div>

      <div className="w-full max-w-4xl p-4 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold mb-2 text-center">{t('selectAPiece')}</h3>
        <div className="flex flex-wrap justify-center gap-2 h-48 overflow-y-auto p-2 bg-gray-100 dark:bg-gray-800 rounded">
            {trayPieces.map(piece => (
                <div key={piece.id} onClick={() => handleSelectTrayPiece(piece)} 
                    className={`cursor-pointer transition-transform duration-200 ${selectedPiece?.id === piece.id ? 'scale-110 ring-4 ring-blue-500 shadow-xl z-10' : 'hover:scale-105'}`}
                    style={{ width: `${90 / Math.sqrt(gridSize*gridSize)}%`, maxWidth: '100px' }}
                >
                    <img src={piece.imgUrl} alt={`tray piece ${piece.id}`} className="w-full h-full object-contain rounded-md shadow-md"/>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default TraditionalPuzzle;