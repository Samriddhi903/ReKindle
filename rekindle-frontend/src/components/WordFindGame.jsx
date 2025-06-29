import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export function WordFindGame() {
  const navigate = useNavigate();
  const [score, setScore] = useState(0);
  const [foundWords, setFoundWords] = useState([]);
  const [selectedCells, setSelectedCells] = useState([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [dragStart, setDragStart] = useState(null);

  const words = ['CAT', 'DOG', 'SUN', 'HAT', 'BAG'];
  // Mixed up grid with words in different directions:
  // CAT: Row 0, Cols 0-2 (horizontal)
  // DOG: Col 4, Rows 0-2 (vertical)
  // SUN: Row 2, Cols 1-3 (horizontal)
  // HAT: Diagonal from [3,0] to [1,2]
  // BAG: Row 4, Cols 0-2 (horizontal)
  const grid = [
    ['C', 'A', 'T', 'L', 'D'],
    ['P', 'M', 'H', 'R', 'O'],
    ['K', 'S', 'U', 'N', 'G'],
    ['H', 'A', 'T', 'F', 'W'],
    ['B', 'A', 'G', 'Q', 'Z']
  ];

  const handleCellMouseDown = (row, col) => {
    setIsSelecting(true);
    setDragStart({ row, col });
    setSelectedCells([{ row, col }]);
  };

  const handleCellMouseEnter = (row, col) => {
    if (isSelecting && dragStart) {
      const newSelected = getCellsBetween(dragStart, { row, col });
      setSelectedCells(newSelected);
    }
  };

  const handleCellMouseUp = () => {
    if (isSelecting && selectedCells.length > 0) {
      checkWord();
      setIsSelecting(false);
      setDragStart(null);
      setSelectedCells([]);
    }
  };

  const handleCellClick = (row, col) => {
    if (!isSelecting) {
      handleCellMouseDown(row, col);
    } else {
      handleCellMouseUp();
    }
  };

  const getCellsBetween = (start, end) => {
    const cells = [];
    const minRow = Math.min(start.row, end.row);
    const maxRow = Math.max(start.row, end.row);
    const minCol = Math.min(start.col, end.col);
    const maxCol = Math.max(start.col, end.col);

    // Check if it's a straight line (horizontal, vertical, or diagonal)
    const isHorizontal = start.row === end.row;
    const isVertical = start.col === end.col;
    const isDiagonal = Math.abs(start.row - end.row) === Math.abs(start.col - end.col);

    if (isHorizontal) {
      for (let col = minCol; col <= maxCol; col++) {
        cells.push({ row: start.row, col });
      }
    } else if (isVertical) {
      for (let row = minRow; row <= maxRow; row++) {
        cells.push({ row, col: start.col });
      }
    } else if (isDiagonal) {
      const rowStep = start.row < end.row ? 1 : -1;
      const colStep = start.col < end.col ? 1 : -1;
      let row = start.row;
      let col = start.col;
      while (row !== end.row + rowStep && col !== end.col + colStep) {
        cells.push({ row, col });
        row += rowStep;
        col += colStep;
      }
    }

    return cells;
  };

  const checkWord = () => {
    if (selectedCells.length === 0) return;

    // Get the word from selected cells
    const word = selectedCells
      .sort((a, b) => {
        if (a.row !== b.row) return a.row - b.row;
        return a.col - b.col;
      })
      .map(cell => grid[cell.row][cell.col])
      .join('');

    // Check both forward and reverse
    const reverseWord = word.split('').reverse().join('');
    
    if (words.includes(word) && !foundWords.includes(word)) {
      setFoundWords([...foundWords, word]);
      setScore(score + 20);
    } else if (words.includes(reverseWord) && !foundWords.includes(reverseWord)) {
      setFoundWords([...foundWords, reverseWord]);
      setScore(score + 20);
    }
  };

  const isCellSelected = (row, col) => {
    return selectedCells.some(cell => cell.row === row && cell.col === col);
  };

  const resetGame = () => {
    setScore(0);
    setFoundWords([]);
    setSelectedCells([]);
    setIsSelecting(false);
    setDragStart(null);
  };

  // Handle mouse up outside of cells
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isSelecting) {
        handleCellMouseUp();
      }
    };

    document.addEventListener('mouseup', handleGlobalMouseUp);
    return () => document.removeEventListener('mouseup', handleGlobalMouseUp);
  }, [isSelecting, selectedCells]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <motion.h1 
        initial={{ scale: 0.8, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }} 
        transition={{ type: 'spring', stiffness: 120, damping: 8, delay: 0.1 }} 
        className="text-4xl md:text-5xl font-extrabold mb-6 text-blue-900 text-center"
      >
        Word Find
      </motion.h1>
      <p className="text-xl md:text-2xl mb-6 max-w-xl text-center font-opendyslexic text-blue-900">
        Click and drag to find words in any direction!
      </p>
      
      <div className="bg-white/80 rounded-2xl shadow-lg p-6 mb-8">
        <div className="flex justify-between items-center">
          <span className="text-xl font-opendyslexic text-blue-900">Score: {score}</span>
          <span className="text-xl font-opendyslexic text-blue-900">
            Found: {foundWords.length}/{words.length}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
        <div className="bg-white/80 rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-blue-900 mb-6 font-lexend text-center">
            Find these words:
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {words.map((word) => (
              <div
                key={word}
                className={`p-3 rounded-lg text-lg font-bold font-opendyslexic text-center ${
                  foundWords.includes(word)
                    ? 'bg-green-200 text-green-800'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {word}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/80 rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-blue-900 mb-6 font-lexend text-center">
            Click and drag to select letters
          </h2>
          <div className="grid grid-cols-5 gap-2 max-w-xs mx-auto">
            {grid.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <motion.div
                  key={`${rowIndex}-${colIndex}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-12 h-12 flex items-center justify-center border-2 border-gray-300 rounded-lg cursor-pointer font-bold text-lg font-opendyslexic select-none ${
                    isCellSelected(rowIndex, colIndex)
                      ? 'bg-pastel-blue text-white border-pastel-blue'
                      : 'bg-white text-blue-900 hover:bg-gray-100'
                  }`}
                  onMouseDown={() => handleCellMouseDown(rowIndex, colIndex)}
                  onMouseEnter={() => handleCellMouseEnter(rowIndex, colIndex)}
                  onMouseUp={() => handleCellMouseUp()}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                >
                  {cell}
                </motion.div>
              ))
            )}
          </div>
          <p className="text-sm text-blue-900 mt-4 text-center font-opendyslexic">
            Drag horizontally, vertically, or diagonally to find words
          </p>
        </div>
      </div>

      {foundWords.length === words.length && (
        <div className="mt-8 bg-white/80 rounded-2xl shadow-lg p-8 max-w-md">
          <h2 className="text-3xl font-bold text-blue-900 mb-4 font-lexend text-center">
            Congratulations!
          </h2>
          <p className="text-xl text-blue-900 mb-6 font-opendyslexic text-center">
            You found all the words! Final Score: {score}
          </p>
          <button
            onClick={resetGame}
            className="bg-pastel-mint hover:bg-pastel-blue transition-colors text-2xl rounded-full px-8 py-4 font-bold shadow-lg focus:outline-none focus:ring-4 focus:ring-pastel-lavender text-blue-900"
          >
            Play Again
          </button>
        </div>
      )}
      
      <button
        onClick={() => navigate('/games')}
        className="mt-8 bg-pastel-lavender hover:bg-pastel-pink transition-colors text-xl rounded-full px-6 py-3 font-bold shadow focus:outline-none focus:ring-4 focus:ring-pastel-blue text-blue-900"
      >
        ← Back to Games
      </button>
    </div>
  );
} 