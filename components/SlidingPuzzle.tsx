
import React, { useState, useEffect, useMemo, useCallback, useContext } from 'react';
import { PuzzleOptions, SlidingTile } from '../types';
import Timer from './Timer';
import { LanguageContext } from '../App';
import Modal from './Modal';

interface SlidingPuzzleProps {
  imageSrc: string;
  options: PuzzleOptions;
  onComplete: () => void;
  onExit: () => void;
}

// Fisher-Yates shuffle
const shuffleTiles = (tiles: SlidingTile[]): SlidingTile[] => {
  const shuffled = [...tiles];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const SlidingPuzzle: React.FC<SlidingPuzzleProps> = ({ imageSrc, options, onComplete, onExit }) => {
  const { gridSize, timerEnabled } = options;
  const [tiles, setTiles] = useState<SlidingTile[]>([]);
  const [isPaused, setIsPaused] = useState(false);

  const context = useContext(LanguageContext);
  if (!context) return null;
  const { t } = context;

  const createTiles = useCallback(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageSrc;
    img.onload = () => {
      const tileWidth = img.width / gridSize;
      const tileHeight = img.height / gridSize;
      const generatedTiles: SlidingTile[] = [];
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = tileWidth;
      canvas.height = tileHeight;

      for (let i = 0; i < gridSize * gridSize - 1; i++) {
        const row = Math.floor(i / gridSize);
        const col = i % gridSize;
        ctx?.clearRect(0, 0, tileWidth, tileHeight);
        ctx?.drawImage(img, col * tileWidth, row * tileHeight, tileWidth, tileHeight, 0, 0, tileWidth, tileHeight);
        generatedTiles.push({
          id: i,
          imgUrl: canvas.toDataURL(),
          originalIndex: i,
        });
      }
      
      generatedTiles.push({ id: gridSize * gridSize - 1, originalIndex: gridSize * gridSize - 1, imgUrl: '', isEmpty: true });
      
      let shuffled = shuffleTiles(generatedTiles);
      // Basic solvability check (very simplified, might not cover all edge cases)
      // A more robust check involves inversion counts, which is complex. This is a basic attempt.
      let inversions = 0;
      for (let i = 0; i < shuffled.length - 1; i++) {
        for (let j = i + 1; j < shuffled.length - 1; j++) {
            if (shuffled[i].originalIndex > shuffled[j].originalIndex) {
                inversions++;
            }
        }
      }
      if (inversions % 2 !== 0) { // If unsolvable, shuffle again
        shuffled = shuffleTiles(shuffled);
      }

      setTiles(shuffled);
    };
  }, [imageSrc, gridSize]);

  useEffect(() => {
    createTiles();
  }, [createTiles]);

  const checkCompletion = useCallback(() => {
    if (tiles.length === 0) return;
    for (let i = 0; i < tiles.length; i++) {
      if (tiles[i].originalIndex !== i) {
        return;
      }
    }
    onComplete();
  }, [tiles, onComplete]);

  useEffect(() => {
    checkCompletion();
  }, [checkCompletion]);


  const handleTileClick = (clickedIndex: number) => {
    if (isPaused) return;
    const emptyIndex = tiles.findIndex(t => t.isEmpty);
    if (emptyIndex === -1) return;

    const { row: clickedRow, col: clickedCol } = { row: Math.floor(clickedIndex / gridSize), col: clickedIndex % gridSize };
    const { row: emptyRow, col: emptyCol } = { row: Math.floor(emptyIndex / gridSize), col: emptyIndex % gridSize };

    const isAdjacent = (Math.abs(clickedRow - emptyRow) + Math.abs(clickedCol - emptyCol)) === 1;

    if (isAdjacent) {
      const newTiles = [...tiles];
      [newTiles[clickedIndex], newTiles[emptyIndex]] = [newTiles[emptyIndex], newTiles[clickedIndex]];
      setTiles(newTiles);
    }
  };

  const imageAspectRatio = useMemo(() => {
    const img = new Image();
    img.src = imageSrc;
    return img.width / img.height;
  }, [imageSrc]);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex w-full justify-between items-start">
        <button onClick={onExit} className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors">← {t('playAgain')}</button>
        {timerEnabled && <Timer isRunning={tiles.length > 0} isPaused={isPaused} onPauseToggle={() => setIsPaused(!isPaused)} />}
      </div>
      
      <div className="relative p-2 bg-gray-800 rounded-lg shadow-2xl" style={{ maxWidth: '600px', width: '90vw' }}>
        <div
          className="grid transition-all duration-300"
          style={{
            gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
            aspectRatio: `${imageAspectRatio}`,
          }}
        >
          {tiles.map((tile, index) => (
            <div
              key={tile.id}
              onClick={() => handleTileClick(index)}
              className={`p-1 transition-all duration-300 ease-in-out ${tile.isEmpty ? 'opacity-0' : 'cursor-pointer'}`}
            >
              {!tile.isEmpty && <img src={tile.imgUrl} alt={`tile ${tile.id}`} className="w-full h-full object-cover rounded shadow-md"/>}
            </div>
          ))}
        </div>
        {isPaused && (
            <Modal isOpen={isPaused} onClose={() => setIsPaused(false)} title={t('gamePaused')}>
              <p className="text-center text-gray-700 dark:text-gray-300">{t('resumeGame')}</p>
            </Modal>
         )}
      </div>
    </div>
  );
};

export default SlidingPuzzle;
