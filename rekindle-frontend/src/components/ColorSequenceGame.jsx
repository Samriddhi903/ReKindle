import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export function ColorSequenceGame() {
  const navigate = useNavigate();
  const [score, setScore] = useState(0);
  const [currentRound, setCurrentRound] = useState(1);
  const [gameState, setGameState] = useState('waiting'); // waiting, playing, gameOver
  const [currentColorName, setCurrentColorName] = useState('');
  const [currentTextColor, setCurrentTextColor] = useState('');
  const [correctColor, setCorrectColor] = useState('');
  const [timeLeft, setTimeLeft] = useState(5);
  const [streak, setStreak] = useState(0);

  const colors = [
    { name: 'Red', class: 'bg-red-500', textColor: '#ef4444', id: 'red' },
    { name: 'Blue', class: 'bg-blue-500', textColor: '#3b82f6', id: 'blue' },
    { name: 'Green', class: 'bg-green-500', textColor: '#10b981', id: 'green' },
    { name: 'Yellow', class: 'bg-yellow-500', textColor: '#eab308', id: 'yellow' },
    { name: 'Purple', class: 'bg-purple-500', textColor: '#8b5cf6', id: 'purple' },
    { name: 'Orange', class: 'bg-orange-500', textColor: '#f97316', id: 'orange' }
  ];

  const generateNewColor = () => {
    // Randomly select a color name
    const colorName = colors[Math.floor(Math.random() * colors.length)];
    
    // Randomly select a different color for the text (can be the same sometimes for extra challenge)
    const textColor = colors[Math.floor(Math.random() * colors.length)];
    
    setCurrentColorName(colorName.name);
    setCurrentTextColor(textColor.textColor);
    setCorrectColor(colorName.id);
    setTimeLeft(5);
  };

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setCurrentRound(1);
    setStreak(0);
    generateNewColor();
  };

  const handleColorClick = (clickedColorId) => {
    if (gameState !== 'playing') return;

    if (clickedColorId === correctColor) {
      // Correct answer
      const points = Math.max(10, 20 - Math.floor(timeLeft / 2)); // More points for faster answers
      setScore(score + points);
      setStreak(streak + 1);
      
      // Show success feedback
      setTimeout(() => {
        setCurrentRound(currentRound + 1);
        generateNewColor();
      }, 500);
    } else {
      // Wrong answer
      setStreak(0);
      setGameState('gameOver');
    }
  };

  const resetGame = () => {
    setGameState('waiting');
    setScore(0);
    setCurrentRound(1);
    setStreak(0);
    setTimeLeft(5);
  };

  // Timer countdown
  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (gameState === 'playing' && timeLeft === 0) {
      // Time's up
      setStreak(0);
      setGameState('gameOver');
    }
  }, [gameState, timeLeft]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <motion.h1 
        initial={{ scale: 0.8, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }} 
        transition={{ type: 'spring', stiffness: 120, damping: 8, delay: 0.1 }} 
        className="text-4xl md:text-5xl font-extrabold mb-6 text-blue-900 text-center"
      >
        Color Challenge
      </motion.h1>
      <p className="text-xl md:text-2xl mb-6 max-w-xl text-center font-opendyslexic text-blue-900">
        Click the color that the word says, not the color it's written in!
      </p>
      
      <div className="bg-white/80 rounded-2xl shadow-lg p-6 mb-8">
        <div className="flex justify-between items-center">
          <span className="text-xl font-opendyslexic text-blue-900">Score: {score}</span>
          <span className="text-xl font-opendyslexic text-blue-900">Round: {currentRound}</span>
          <span className="text-xl font-opendyslexic text-blue-900">Streak: {streak}</span>
        </div>
      </div>

      {gameState === 'waiting' && (
        <div className="bg-white/80 rounded-2xl shadow-lg p-8 max-w-md">
          <h2 className="text-2xl font-bold text-blue-900 mb-6 font-lexend text-center">
            Ready for the Color Challenge?
          </h2>
          <p className="text-lg text-blue-900 mb-6 font-opendyslexic text-center">
            You'll see color names written in different colors. Click the button that matches the WORD, not the color it's written in!
          </p>
          <button
            onClick={startGame}
            className="bg-pastel-mint hover:bg-pastel-blue transition-colors text-2xl rounded-full px-8 py-4 font-bold shadow-lg focus:outline-none focus:ring-4 focus:ring-pastel-lavender text-blue-900"
          >
            Start Game
          </button>
        </div>
      )}

      {gameState === 'playing' && (
        <div className="bg-white/80 rounded-2xl shadow-lg p-8 max-w-2xl">
          <div className="text-center mb-8">
            <div className="text-6xl font-bold mb-4" style={{ color: currentTextColor }}>
              {currentColorName}
            </div>
            <div className="text-2xl font-opendyslexic text-blue-900">
              Time left: {timeLeft}s
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-lg mx-auto">
            {colors.map((color) => (
              <motion.button
                key={color.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`w-20 h-20 rounded-full ${color.class} cursor-pointer shadow-lg border-2 border-white hover:border-blue-300 transition-all duration-200`}
                onClick={() => handleColorClick(color.id)}
              >
                <span className="sr-only">{color.name}</span>
              </motion.button>
            ))}
          </div>
          
          <div className="text-center mt-6">
            <p className="text-lg font-opendyslexic text-blue-900">
              Click the color that matches the word "{currentColorName}"
            </p>
          </div>
        </div>
      )}

      {gameState === 'gameOver' && (
        <div className="bg-white/80 rounded-2xl shadow-lg p-8 max-w-md">
          <h2 className="text-3xl font-bold text-blue-900 mb-4 font-lexend text-center">
            Game Over!
          </h2>
          <p className="text-xl text-blue-900 mb-2 font-opendyslexic text-center">
            Final Score: {score}
          </p>
          <p className="text-lg text-blue-900 mb-6 font-opendyslexic text-center">
            Rounds completed: {currentRound - 1}
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