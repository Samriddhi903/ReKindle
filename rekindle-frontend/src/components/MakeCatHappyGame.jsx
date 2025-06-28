import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import happyCat from '../assets/happy cat.png';
import sadCat from '../assets/sad cat.png';
import correctSticker from '../assets/correct.png';
import wrongSticker from '../assets/wrong.png';

export function MakeCatHappyGame() {
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [catType, setCatType] = useState('happy'); // 'happy' or 'sad'
  const [position, setPosition] = useState({ top: 200, left: 200 });
  const [intervalId, setIntervalId] = useState(null);
  const [happiness, setHappiness] = useState(50); // 0 (sad) to 100 (happy)
  const [endMsg, setEndMsg] = useState('');
  const [showSticker, setShowSticker] = useState(null); // 'correct' | 'wrong' | null

  useEffect(() => {
    if (gameOver) {
      if (intervalId) clearInterval(intervalId);
      return;
    }
    // Show a new cat every 900ms
    const id = setInterval(() => {
      setCatType(Math.random() < 0.5 ? 'happy' : 'sad');
      // Cat image is 224x224px, box is 500x500px. Always keep the cat fully inside the box.
      const boxSize = 500;
      const catSize = 224;
      const min = 0;
      const max = boxSize - catSize; // 276
      let top = Math.floor(Math.random() * (max - min + 1)) + min;
      let left = Math.floor(Math.random() * (max - min + 1)) + min;
      // Clamp to ensure the cat never goes out of the box
      top = Math.max(min, Math.min(max, top));
      left = Math.max(min, Math.min(max, left));
      setPosition({ top, left });
    }, 900);
    setIntervalId(id);
    return () => clearInterval(id);
  }, [gameOver]);

  useEffect(() => {
    if (happiness <= 0) {
      setEndMsg('Cat is very sad!');
      setGameOver(true);
    } else if (happiness >= 100) {
      setEndMsg('Cat is super happy!');
      setGameOver(true);
    }
  }, [happiness]);

  const handleCatClick = () => {
    if (catType === 'sad') {
      setHappiness(h => Math.max(0, h - 15));
      setScore(score + 1);
      setShowSticker('wrong');
    } else {
      setHappiness(h => Math.min(100, h + 10));
      setScore(score + 1);
      setShowSticker('correct');
    }
    setTimeout(() => setShowSticker(null), 1000);
  };

  const handleRestart = () => {
    setGameOver(false);
    setScore(0);
    setHappiness(50);
    setEndMsg('');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] relative">
      <motion.h1 
        initial={{ scale: 0.8, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }} 
        transition={{ type: 'spring', stiffness: 120, damping: 8, delay: 0.1 }} 
        className="text-4xl md:text-5xl font-extrabold mb-6 text-blue-900 text-center"
      >
        Make Cat Happy!
      </motion.h1>
      <p className="text-xl md:text-2xl mb-6 max-w-xl text-center font-opendyslexic text-blue-900">
        Click the happy cat to make it happier! If you click a sad cat, it gets sadder. Reach either extreme to end the game.
      </p>
      
      {/* Happiness Bar */}
      <div className="w-[500px] h-4 bg-pastel-mint/40 rounded-full mb-4 overflow-hidden border border-pastel-mint">
        <div
          className={`h-full transition-all duration-300 ${happiness > 70 ? 'bg-pastel-pink' : happiness < 30 ? 'bg-pastel-blue' : 'bg-pastel-yellow'}`}
          style={{ width: `${happiness}%` }}
        ></div>
      </div>
      
      <div className="relative w-[500px] h-[500px] bg-white/60 rounded-2xl shadow-lg flex items-center justify-center overflow-hidden">
        {!gameOver ? (
          <>
            <img
              src={catType === 'happy' ? happyCat : sadCat}
              alt={catType === 'happy' ? 'Happy Cat' : 'Sad Cat'}
              className="absolute cursor-pointer transition-all duration-200 hover:scale-110"
              style={{ top: position.top, left: position.left }}
              onClick={handleCatClick}
            />
            {showSticker && (
              <img
                src={showSticker === 'correct' ? correctSticker : wrongSticker}
                alt={showSticker === 'correct' ? 'Correct' : 'Wrong'}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 pointer-events-none"
              />
            )}
          </>
        ) : (
          <div className="text-center">
            <h2 className="text-3xl font-bold text-blue-900 mb-4">{endMsg}</h2>
            <p className="text-xl text-blue-900 mb-6">Final Score: {score}</p>
            <button
              onClick={handleRestart}
              className="bg-pastel-mint hover:bg-pastel-blue transition-colors text-2xl rounded-full px-8 py-4 font-bold shadow-lg focus:outline-none focus:ring-4 focus:ring-pastel-lavender text-blue-900"
            >
              Play Again
            </button>
          </div>
        )}
      </div>
      
      <div className="mt-6 text-center">
        <p className="text-lg text-blue-900">Score: {score}</p>
        <p className="text-lg text-blue-900">Happiness: {happiness}%</p>
      </div>
    </div>
  );
} 