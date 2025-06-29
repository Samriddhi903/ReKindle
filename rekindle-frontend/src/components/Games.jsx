import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import happyCat from '../assets/happy cat.png';
import familyPlaceholder from '../assets/background.jpg';

const Games = () => {
  const navigate = useNavigate();
  const { token, userId } = useAuth();
  const [familyPhotoUrl, setFamilyPhotoUrl] = useState(null);
  const [loadingPhoto, setLoadingPhoto] = useState(false);
  
  // Fetch family photo for preview
  useEffect(() => {
    const fetchFamilyPhoto = async () => {
      try {
        setLoadingPhoto(true);
        
        // Build URL with userId if not authenticated
        let url = 'https://rekindle-zyhh.onrender.com/api/family-photo';
        const headers = {};
        
        if (token && userId) {
          // Authenticated user - use Authorization header
          headers['Authorization'] = `Bearer ${token}`;
        } else {
          // Not authenticated - use userId from localStorage as query parameter
          const tempUserId = localStorage.getItem('tempUserId');
          if (tempUserId) {
            url += `?userId=${tempUserId}`;
          }
        }

        const response = await fetch(url, { headers });

        if (response.ok) {
          const blob = await response.blob();
          const url = URL.createObjectURL(blob);
          setFamilyPhotoUrl(url);
        } else {
          console.log('Family photo not found, using placeholder');
          setFamilyPhotoUrl(null);
        }
      } catch (err) {
        console.error('Error fetching family photo for preview:', err);
        setFamilyPhotoUrl(null);
      } finally {
        setLoadingPhoto(false);
      }
    };

    fetchFamilyPhoto();
  }, [token, userId]);

  return (
    <>
      <motion.h1 
        initial={{ scale: 0.8, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }} 
        transition={{ type: 'spring', stiffness: 120, damping: 8, delay: 0.1 }} 
        className="text-4xl md:text-5xl font-extrabold mb-6 text-blue-900 text-center"
      >
        Games
      </motion.h1>
      <p className="text-xl md:text-2xl mb-10 max-w-xl text-center font-opendyslexic text-blue-900">
        Personalized memory-assistive games will appear here!
      </p>
      <div className="flex flex-wrap gap-8 justify-center">
        <button
          onClick={() => navigate('/make-cat-happy')}
          className="flex flex-col items-center bg-white/80 hover:bg-pastel-mint/60 transition rounded-2xl shadow-lg px-8 py-6 w-64 focus:outline-none focus:ring-4 focus:ring-pastel-blue"
        >
          <img src={happyCat} alt="Happy Cat" className="w-20 h-20 mb-4" />
          <span className="text-2xl font-bold text-blue-900 mb-2">Make Cat Happy</span>
          <span className="text-blue-900 text-lg">Click the happy cat to make it happier!</span>
        </button>
        <button
          onClick={() => navigate('/complete-family-picture')}
          className="flex flex-col items-center bg-white/80 hover:bg-pastel-mint/60 transition rounded-2xl shadow-lg px-8 py-6 w-64 focus:outline-none focus:ring-4 focus:ring-pastel-blue"
        >
          <div className="w-20 h-20 mb-4 rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center">
            {loadingPhoto ? (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900"></div>
            ) : familyPhotoUrl ? (
              <img 
                src={familyPhotoUrl} 
                alt="Your Family Photo" 
                className="w-full h-full object-cover"
              />
            ) : (
              <img 
                src={familyPlaceholder} 
                alt="Family Placeholder" 
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <span className="text-2xl font-bold text-blue-900 mb-2">Complete the Family Picture</span>
          <span className="text-blue-900 text-lg">
            {familyPhotoUrl ? 'Rearrange the pieces to complete your family photo!' : 'Upload a family photo in your details to play this game!'}
          </span>
        </button>
        
        {/* New Games */}
        <button
          onClick={() => navigate('/family-photo-match')}
          className="flex flex-col items-center bg-white/80 hover:bg-pastel-mint/60 transition rounded-2xl shadow-lg px-8 py-6 w-64 focus:outline-none focus:ring-4 focus:ring-pastel-blue"
        >
          <div className="text-4xl mb-4">👨‍👩‍👧‍👦</div>
          <span className="text-2xl font-bold text-blue-900 mb-2">Family Photo Match</span>
          <span className="text-blue-900 text-lg">Match family photos with names</span>
        </button>
        
        <button
          onClick={() => navigate('/simple-math')}
          className="flex flex-col items-center bg-white/80 hover:bg-pastel-mint/60 transition rounded-2xl shadow-lg px-8 py-6 w-64 focus:outline-none focus:ring-4 focus:ring-pastel-blue"
        >
          <div className="text-4xl mb-4">🧮</div>
          <span className="text-2xl font-bold text-blue-900 mb-2">Simple Math</span>
          <span className="text-blue-900 text-lg">Easy addition and subtraction</span>
        </button>
        
        <button
          onClick={() => navigate('/color-sequence')}
          className="flex flex-col items-center bg-white/80 hover:bg-pastel-mint/60 transition rounded-2xl shadow-lg px-8 py-6 w-64 focus:outline-none focus:ring-4 focus:ring-pastel-blue"
        >
          <div className="text-4xl mb-4">🎨</div>
          <span className="text-2xl font-bold text-blue-900 mb-2">Color Sequence</span>
          <span className="text-blue-900 text-lg">Remember and repeat color patterns</span>
        </button>
        
        <button
          onClick={() => navigate('/word-find')}
          className="flex flex-col items-center bg-white/80 hover:bg-pastel-mint/60 transition rounded-2xl shadow-lg px-8 py-6 w-64 focus:outline-none focus:ring-4 focus:ring-pastel-blue"
        >
          <div className="text-4xl mb-4">📝</div>
          <span className="text-2xl font-bold text-blue-900 mb-2">Word Find</span>
          <span className="text-blue-900 text-lg">Find simple words in a grid</span>
        </button>
      </div>
    </>
  );
};

// Make Cat Happy Game Component
const MakeCatHappyGame = ({ onBack }) => {
  const [score, setScore] = useState(0);
  const [happiness, setHappiness] = useState(50);
  const [gameActive, setGameActive] = useState(true);
  const [showCat, setShowCat] = useState(false);
  const [catType, setCatType] = useState('happy');
  const [interval, setInterval] = useState(2000);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackType, setFeedbackType] = useState('');

  React.useEffect(() => {
    if (!gameActive) return;

    const timer = setTimeout(() => {
      if (gameActive) {
        setCatType(Math.random() > 0.6 ? 'happy' : 'sad');
        setShowCat(true);
      }
    }, interval);

    return () => clearTimeout(timer);
  }, [interval, gameActive]);

  const handleCatClick = (type) => {
    if (type === 'happy') {
      setScore(score + 1);
      setHappiness(Math.min(100, happiness + 10));
      setFeedbackType('correct');
      setShowFeedback(true);
      setTimeout(() => setShowFeedback(false), 1000);
    } else {
      setHappiness(Math.max(0, happiness - 15));
      setFeedbackType('wrong');
      setShowFeedback(true);
      setTimeout(() => setShowFeedback(false), 1000);
    }

    setShowCat(false);
    setInterval(Math.max(500, interval - 50));

    if (happiness <= 0 || happiness >= 100) {
      setGameActive(false);
    }
  };

  const resetGame = () => {
    setScore(0);
    setHappiness(50);
    setGameActive(true);
    setShowCat(false);
    setInterval(2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 p-8 relative">
      <button
        onClick={onBack}
        className="absolute top-8 left-8 bg-white bg-opacity-80 px-4 py-2 rounded-full text-gray-700 hover:bg-opacity-100 transition-all duration-300 font-['Lexend']"
      >
        ← Back to Games
      </button>

      <div className="max-w-2xl mx-auto text-center pt-16">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 font-['Lexend']">
          Make Cat Happy!
        </h1>

        <div className="bg-white bg-opacity-80 rounded-2xl p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xl font-['OpenDyslexic']">Score: {score}</span>
            <span className="text-xl font-['OpenDyslexic']">Happiness: {happiness}%</span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
            <div 
              className={`h-4 rounded-full transition-all duration-500 ${
                happiness > 70 ? 'bg-green-500' : happiness > 30 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${happiness}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white bg-opacity-80 rounded-2xl p-8 min-h-64 flex items-center justify-center">
          {gameActive ? (
            showCat ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.1 }}
                className="cursor-pointer"
                onClick={() => handleCatClick(catType)}
              >
                <img
                  src={catType === 'happy' ? '/src/assets/happy cat.png' : '/src/assets/sad cat.png'}
                  alt={catType === 'happy' ? 'Happy Cat' : 'Sad Cat'}
                  className="w-32 h-32 object-contain"
                />
              </motion.div>
            ) : (
              <p className="text-2xl text-gray-600 font-['OpenDyslexic']">
                Wait for the cat to appear...
              </p>
            )
          ) : (
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-4 font-['Lexend']">
                Game Over!
              </h2>
              <p className="text-xl text-gray-600 mb-6 font-['OpenDyslexic']">
                Final Score: {score}
              </p>
              <button
                onClick={resetGame}
                className="bg-pink-400 text-white px-6 py-3 rounded-full text-xl font-['Lexend'] hover:bg-pink-500 transition-colors"
              >
                Play Again
              </button>
            </div>
          )}
        </div>

        {showFeedback && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="fixed bottom-8 right-8"
          >
            <img
              src={feedbackType === 'correct' ? '/src/assets/correct.png' : '/src/assets/wrong.png'}
              alt={feedbackType === 'correct' ? 'Correct' : 'Wrong'}
              className="w-16 h-16 object-contain"
            />
          </motion.div>
        )}
      </div>
    </div>
  );
};

// Family Photo Match Game Component
const FamilyPhotoMatchGame = ({ onBack }) => {
  const [score, setScore] = useState(0);
  const [currentRound, setCurrentRound] = useState(1);
  const [gameActive, setGameActive] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [matchedPhotos, setMatchedPhotos] = useState([]);

  // Mock family data - in real app, this would come from user's uploaded photos
  const familyMembers = [
    { id: 1, name: 'Mom', photo: '/src/assets/hello.png' },
    { id: 2, name: 'Dad', photo: '/src/assets/hi.png' },
    { id: 3, name: 'Sister', photo: '/src/assets/read.png' },
    { id: 4, name: 'Brother', photo: '/src/assets/eat.png' }
  ];

  const handlePhotoClick = (member) => {
    if (matchedPhotos.includes(member.id)) return;
    
    if (!selectedPhoto) {
      setSelectedPhoto(member);
    } else {
      if (selectedPhoto.id === member.id) {
        setScore(score + 10);
        setMatchedPhotos([...matchedPhotos, member.id]);
        setSelectedPhoto(null);
        
        if (matchedPhotos.length + 1 === familyMembers.length) {
          setGameActive(false);
        }
      } else {
        setScore(Math.max(0, score - 2));
        setSelectedPhoto(null);
      }
    }
  };

  const resetGame = () => {
    setScore(0);
    setCurrentRound(1);
    setGameActive(true);
    setSelectedPhoto(null);
    setMatchedPhotos([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-8">
      <button
        onClick={onBack}
        className="absolute top-8 left-8 bg-white bg-opacity-80 px-4 py-2 rounded-full text-gray-700 hover:bg-opacity-100 transition-all duration-300 font-['Lexend']"
      >
        ← Back to Games
      </button>

      <div className="max-w-4xl mx-auto text-center pt-16">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 font-['Lexend']">
          Family Photo Match
        </h1>

        <div className="bg-white bg-opacity-80 rounded-2xl p-6 mb-8">
          <div className="flex justify-between items-center">
            <span className="text-xl font-['OpenDyslexic']">Score: {score}</span>
            <span className="text-xl font-['OpenDyslexic']">Round: {currentRound}</span>
          </div>
        </div>

        {gameActive ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {familyMembers.map((member) => (
              <motion.div
                key={member.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`bg-white bg-opacity-80 rounded-2xl p-4 cursor-pointer transition-all duration-300 ${
                  selectedPhoto?.id === member.id ? 'ring-4 ring-blue-400' : ''
                } ${
                  matchedPhotos.includes(member.id) ? 'opacity-50' : ''
                }`}
                onClick={() => handlePhotoClick(member)}
              >
                <img
                  src={member.photo}
                  alt={member.name}
                  className="w-24 h-24 object-contain mx-auto mb-2"
                />
                <p className="text-lg font-bold text-gray-800 font-['Lexend']">
                  {member.name}
                </p>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-4 font-['Lexend']">
              Great Job!
            </h2>
            <p className="text-xl text-gray-600 mb-6 font-['OpenDyslexic']">
              You matched all family members! Final Score: {score}
            </p>
            <button
              onClick={resetGame}
              className="bg-blue-400 text-white px-6 py-3 rounded-full text-xl font-['Lexend'] hover:bg-blue-500 transition-colors"
            >
              Play Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Simple Math Game Component
const SimpleMathGame = ({ onBack }) => {
  const [score, setScore] = useState(0);
  const [currentProblem, setCurrentProblem] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);

  const generateProblem = () => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const operation = Math.random() > 0.5 ? '+' : '-';
    const answer = operation === '+' ? num1 + num2 : num1 - num2;
    
    setCurrentProblem({ num1, num2, operation, answer });
    setUserAnswer('');
    setFeedback('');
    setShowFeedback(false);
  };

  React.useEffect(() => {
    generateProblem();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const isCorrect = parseInt(userAnswer) === currentProblem.answer;
    
    if (isCorrect) {
      setScore(score + 10);
      setFeedback('Correct! 🎉');
    } else {
      setScore(Math.max(0, score - 2));
      setFeedback(`Try again! The answer was ${currentProblem.answer}`);
    }
    
    setShowFeedback(true);
    setTimeout(() => {
      generateProblem();
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-blue-100 to-purple-100 p-8">
      <button
        onClick={onBack}
        className="absolute top-8 left-8 bg-white bg-opacity-80 px-4 py-2 rounded-full text-gray-700 hover:bg-opacity-100 transition-all duration-300 font-['Lexend']"
      >
        ← Back to Games
      </button>

      <div className="max-w-2xl mx-auto text-center pt-16">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 font-['Lexend']">
          Simple Math
        </h1>

        <div className="bg-white bg-opacity-80 rounded-2xl p-6 mb-8">
          <span className="text-2xl font-['OpenDyslexic']">Score: {score}</span>
        </div>

        {currentProblem && (
          <div className="bg-white bg-opacity-80 rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 font-['Lexend']">
              What is {currentProblem.num1} {currentProblem.operation} {currentProblem.num2}?
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="number"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                className="text-3xl text-center w-32 h-16 border-4 border-gray-300 rounded-2xl font-['OpenDyslexic'] focus:border-blue-400 focus:outline-none"
                placeholder="?"
                autoFocus
              />
              <br />
              <button
                type="submit"
                className="bg-green-400 text-white px-8 py-4 rounded-full text-xl font-['Lexend'] hover:bg-green-500 transition-colors"
              >
                Check Answer
              </button>
            </form>

            {showFeedback && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 text-2xl font-bold font-['OpenDyslexic']"
              >
                {feedback}
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Color Sequence Game Component
const ColorSequenceGame = ({ onBack }) => {
  const [score, setScore] = useState(0);
  const [sequence, setSequence] = useState([]);
  const [userSequence, setUserSequence] = useState([]);
  const [gameState, setGameState] = useState('waiting'); // waiting, showing, playing, gameOver
  const [level, setLevel] = useState(1);

  const colors = [
    { name: 'Red', class: 'bg-red-500', id: 'red' },
    { name: 'Blue', class: 'bg-blue-500', id: 'blue' },
    { name: 'Green', class: 'bg-green-500', id: 'green' },
    { name: 'Yellow', class: 'bg-yellow-500', id: 'yellow' }
  ];

  const generateSequence = () => {
    const newSequence = [];
    for (let i = 0; i < level + 2; i++) {
      newSequence.push(colors[Math.floor(Math.random() * colors.length)]);
    }
    setSequence(newSequence);
    setUserSequence([]);
    setGameState('showing');
    showSequence(newSequence, 0);
  };

  const showSequence = (seq, index) => {
    if (index >= seq.length) {
      setGameState('playing');
      return;
    }

    setTimeout(() => {
      showSequence(seq, index + 1);
    }, 1000);
  };

  const handleColorClick = (color) => {
    if (gameState !== 'playing') return;

    const newUserSequence = [...userSequence, color];
    setUserSequence(newUserSequence);

    if (newUserSequence[newUserSequence.length - 1].id !== sequence[newUserSequence.length - 1].id) {
      setGameState('gameOver');
      return;
    }

    if (newUserSequence.length === sequence.length) {
      setScore(score + level * 10);
      setLevel(level + 1);
      setTimeout(() => {
        generateSequence();
      }, 1000);
    }
  };

  const resetGame = () => {
    setScore(0);
    setLevel(1);
    setSequence([]);
    setUserSequence([]);
    setGameState('waiting');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 p-8">
      <button
        onClick={onBack}
        className="absolute top-8 left-8 bg-white bg-opacity-80 px-4 py-2 rounded-full text-gray-700 hover:bg-opacity-100 transition-all duration-300 font-['Lexend']"
      >
        ← Back to Games
      </button>

      <div className="max-w-2xl mx-auto text-center pt-16">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 font-['Lexend']">
          Color Sequence
        </h1>

        <div className="bg-white bg-opacity-80 rounded-2xl p-6 mb-8">
          <div className="flex justify-between items-center">
            <span className="text-xl font-['OpenDyslexic']">Score: {score}</span>
            <span className="text-xl font-['OpenDyslexic']">Level: {level}</span>
          </div>
        </div>

        {gameState === 'waiting' && (
          <div className="bg-white bg-opacity-80 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 font-['Lexend']">
              Watch the sequence and repeat it!
            </h2>
            <button
              onClick={generateSequence}
              className="bg-purple-400 text-white px-8 py-4 rounded-full text-xl font-['Lexend'] hover:bg-purple-500 transition-colors"
            >
              Start Game
            </button>
          </div>
        )}

        {gameState === 'showing' && (
          <div className="bg-white bg-opacity-80 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 font-['Lexend']">
              Watch carefully...
            </h2>
            <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto">
              {colors.map((color) => (
                <div
                  key={color.id}
                  className={`w-20 h-20 rounded-full ${color.class} ${
                    sequence[userSequence.length]?.id === color.id ? 'ring-4 ring-white' : ''
                  }`}
                ></div>
              ))}
            </div>
          </div>
        )}

        {gameState === 'playing' && (
          <div className="bg-white bg-opacity-80 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 font-['Lexend']">
              Your turn! Repeat the sequence
            </h2>
            <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto">
              {colors.map((color) => (
                <motion.div
                  key={color.id}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={`w-20 h-20 rounded-full ${color.class} cursor-pointer`}
                  onClick={() => handleColorClick(color)}
                ></motion.div>
              ))}
            </div>
          </div>
        )}

        {gameState === 'gameOver' && (
          <div className="bg-white bg-opacity-80 rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4 font-['Lexend']">
              Game Over!
            </h2>
            <p className="text-xl text-gray-600 mb-6 font-['OpenDyslexic']">
              Final Score: {score}
            </p>
            <button
              onClick={resetGame}
              className="bg-purple-400 text-white px-6 py-3 rounded-full text-xl font-['Lexend'] hover:bg-purple-500 transition-colors"
            >
              Play Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Word Find Game Component
const WordFindGame = ({ onBack }) => {
  const [score, setScore] = useState(0);
  const [foundWords, setFoundWords] = useState([]);
  const [selectedCells, setSelectedCells] = useState([]);
  const [isSelecting, setIsSelecting] = useState(false);

  const words = ['CAT', 'DOG', 'SUN', 'HAT', 'BAG'];
  const grid = [
    ['C', 'A', 'T', 'D', 'O'],
    ['A', 'S', 'U', 'G', 'A'],
    ['T', 'U', 'N', 'B', 'T'],
    ['H', 'A', 'G', 'A', 'S'],
    ['B', 'G', 'S', 'T', 'U']
  ];

  const handleCellClick = (row, col) => {
    if (!isSelecting) {
      setIsSelecting(true);
      setSelectedCells([{ row, col }]);
    } else {
      const newSelected = [...selectedCells, { row, col }];
      setSelectedCells(newSelected);
      
      // Check if we have a valid word
      const word = newSelected.map(cell => grid[cell.row][cell.col]).join('');
      if (words.includes(word) && !foundWords.includes(word)) {
        setFoundWords([...foundWords, word]);
        setScore(score + 20);
      }
      
      setIsSelecting(false);
      setSelectedCells([]);
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
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-orange-100 to-red-100 p-8">
      <button
        onClick={onBack}
        className="absolute top-8 left-8 bg-white bg-opacity-80 px-4 py-2 rounded-full text-gray-700 hover:bg-opacity-100 transition-all duration-300 font-['Lexend']"
      >
        ← Back to Games
      </button>

      <div className="max-w-4xl mx-auto text-center pt-16">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 font-['Lexend']">
          Word Find
        </h1>

        <div className="bg-white bg-opacity-80 rounded-2xl p-6 mb-8">
          <div className="flex justify-between items-center">
            <span className="text-xl font-['OpenDyslexic']">Score: {score}</span>
            <span className="text-xl font-['OpenDyslexic']">
              Found: {foundWords.length}/{words.length}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white bg-opacity-80 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 font-['Lexend']">
              Find these words:
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {words.map((word) => (
                <div
                  key={word}
                  className={`p-3 rounded-lg text-lg font-bold font-['OpenDyslexic'] ${
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

          <div className="bg-white bg-opacity-80 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 font-['Lexend']">
              Click letters to find words
            </h2>
            <div className="grid grid-cols-5 gap-2 max-w-xs mx-auto">
              {grid.map((row, rowIndex) =>
                row.map((cell, colIndex) => (
                  <motion.div
                    key={`${rowIndex}-${colIndex}`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`w-12 h-12 flex items-center justify-center border-2 border-gray-300 rounded-lg cursor-pointer font-bold text-lg font-['OpenDyslexic'] ${
                      isCellSelected(rowIndex, colIndex)
                        ? 'bg-blue-400 text-white'
                        : 'bg-white text-gray-800'
                    }`}
                    onClick={() => handleCellClick(rowIndex, colIndex)}
                  >
                    {cell}
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>

        {foundWords.length === words.length && (
          <div className="mt-8 bg-white bg-opacity-80 rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4 font-['Lexend']">
              Congratulations!
            </h2>
            <p className="text-xl text-gray-600 mb-6 font-['OpenDyslexic']">
              You found all the words! Final Score: {score}
            </p>
            <button
              onClick={resetGame}
              className="bg-yellow-400 text-white px-6 py-3 rounded-full text-xl font-['Lexend'] hover:bg-yellow-500 transition-colors"
            >
              Play Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Games; 