import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import completePicFallback from '../assets/completepic.png';
import happyCat from '../assets/happy cat.png';
import sadCat from '../assets/sad cat.png';

// Fisher-Yates shuffle utility
function shuffleArray(array) {
  const arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function CompleteFamilyPictureGame() {
  const navigate = useNavigate();
  const { loggedIn, token } = useAuth();
  const gridSize = 3;
  const [pieces, setPieces] = useState([]);
  const [draggedIdx, setDraggedIdx] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [imgSrc, setImgSrc] = useState(completePicFallback);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showCat, setShowCat] = useState(false);
  const [catType, setCatType] = useState('happy');
  const [hasStartedPlaying, setHasStartedPlaying] = useState(false);

  useEffect(() => {
    setPieces(shuffleArray(Array.from({ length: gridSize * gridSize }, (_, i) => i)));
    setCompleted(false);
    setShowSuccess(false);
    setShowCat(false);
    setHasStartedPlaying(false);
    
    const fetchFamilyPhoto = async () => {
      try {
        if (!loggedIn) {
          console.log('User not logged in, using fallback');
          setImgSrc(completePicFallback);
          return;
        }
        
        console.log('Fetching family photo for logged in user, token:', token ? 'present' : 'missing');
        
        const response = await fetch('http://localhost:5000/api/family-photo', {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        console.log('Family photo response status:', response.status);
        
        if (response.ok) {
          const blob = await response.blob();
          console.log('Family photo loaded successfully, size:', blob.size, 'bytes');
          setImgSrc(URL.createObjectURL(blob));
        } else {
          console.log('Family photo not found, using fallback');
          setImgSrc(completePicFallback);
        }
      } catch (err) {
        console.error('Error fetching family photo:', err);
        setImgSrc(completePicFallback);
      }
    };

    fetchFamilyPhoto();
  }, [loggedIn, token]);

  const handleDragStart = idx => setDraggedIdx(idx);
  const handleDrop = idx => {
    if (draggedIdx === null || draggedIdx === idx) return;
    
    setHasStartedPlaying(true);
    const newPieces = pieces.slice();
    [newPieces[draggedIdx], newPieces[idx]] = [newPieces[idx], newPieces[draggedIdx]];
    setPieces(newPieces);
    setDraggedIdx(null);
    
    if (newPieces.every((v, i) => v === i)) {
      // Puzzle completed successfully
      setCompleted(true);
      setShowSuccess(true);
      setCatType('happy');
      setShowCat(true);
      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
        setShowCat(false);
      }, 3000);
    } else if (hasStartedPlaying && !showCat) {
      // Show sad cat only if we haven't shown it yet and puzzle is incomplete
      setCatType('sad');
      setShowCat(true);
    }
  };
  const handleDragOver = e => e.preventDefault();

  const pieceStyle = idx => {
    const row = Math.floor(idx / gridSize);
    const col = idx % gridSize;
    return {
      backgroundImage: `url(${imgSrc})`,
      backgroundSize: `${gridSize * 100}% ${gridSize * 100}%`,
      backgroundPosition: `${(col * 100) / (gridSize - 1)}% ${(row * 100) / (gridSize - 1)}%`,
      width: 120,
      height: 120,
      border: '2px solid #a5b4fc',
      borderRadius: 12,
      boxShadow: '0 2px 8px #c7d2fe',
      cursor: 'grab',
      backgroundColor: '#fff',
    };
  };

  const handleShuffle = () => {
    setPieces(shuffleArray(Array.from({ length: gridSize * gridSize }, (_, i) => i)));
    setCompleted(false);
    setShowSuccess(false);
    setShowCat(false);
    setHasStartedPlaying(false);
    
    const fetchFamilyPhoto = async () => {
      try {
        if (!loggedIn) {
          setImgSrc(completePicFallback);
          return;
        }
        
        const response = await fetch('http://localhost:5000/api/family-photo', {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (response.ok) {
          const blob = await response.blob();
          setImgSrc(URL.createObjectURL(blob));
        } else {
          console.log('Family photo not found, using fallback');
          setImgSrc(completePicFallback);
        }
      } catch (err) {
        console.error('Error fetching family photo:', err);
        setImgSrc(completePicFallback);
      }
    };

    fetchFamilyPhoto();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] relative">
      <motion.h1 
        initial={{ scale: 0.8, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }} 
        transition={{ type: 'spring', stiffness: 120, damping: 8, delay: 0.1 }} 
        className="text-4xl md:text-5xl font-extrabold mb-6 text-blue-900 text-center"
      >
        Complete the Family Picture
      </motion.h1>
      <p className="text-xl md:text-2xl mb-6 max-w-xl text-center font-opendyslexic text-blue-900">
        Mr. Axolot dropped his family picture, can you help him?
      </p>
      
      <div className="grid grid-cols-3 grid-rows-3 gap-2 mb-6" style={{ width: 366, height: 366 }}>
        {pieces.map((pieceIdx, idx) => (
          <div
            key={idx}
            draggable
            onDragStart={() => handleDragStart(idx)}
            onDrop={() => handleDrop(idx)}
            onDragOver={handleDragOver}
            style={pieceStyle(pieceIdx)}
            aria-label={`Puzzle piece ${pieceIdx + 1}`}
            tabIndex={0}
          />
        ))}
      </div>
      
      {completed && (
        <div className="text-2xl font-bold text-pastel-mint mb-4">
          You fixed my family picture! Thank you so much.
        </div>
      )}
      
      <div className="flex gap-4">
        <button 
          onClick={handleShuffle}
          className="bg-pastel-blue hover:bg-pastel-mint transition-colors text-xl rounded-full px-6 py-3 font-bold shadow focus:outline-none focus:ring-4 focus:ring-pastel-lavender text-blue-900"
        >
          Shuffle Again
        </button>
        
        <button
          onClick={() => navigate('/games')}
          className="bg-pastel-lavender hover:bg-pastel-pink transition-colors text-xl rounded-full px-6 py-3 font-bold shadow focus:outline-none focus:ring-4 focus:ring-pastel-blue text-blue-900"
        >
          ← Back to Games
        </button>
      </div>

      {/* Cat Animation */}
      <AnimatePresence>
        {showCat && (
          <motion.div
            key="cat-wrap"
            initial={{ x: 120, opacity: 0, scale: 0.7 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            exit={{ x: 120, opacity: 0, scale: 0.7 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            className="fixed right-24 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center pointer-events-none select-none"
          >
            <span className="mb-2 text-2xl font-extrabold text-blue-900 drop-shadow-lg">
              {catType === 'happy' ? 'Yayyy! You did it!' : 'Oh no, poor mr. axolot!'}
            </span>
            <img
              src={catType === 'happy' ? happyCat : sadCat}
              alt={catType === 'happy' ? 'Happy Cat' : 'Sad Cat'}
              className="w-64 h-64"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Message Animation */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: -50 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
          >
            <div className="bg-white/95 rounded-3xl p-8 shadow-2xl border-4 border-pastel-mint">
              <motion.div
                initial={{ rotate: -10 }}
                animate={{ rotate: 10 }}
                transition={{ repeat: Infinity, repeatType: 'reverse', duration: 0.5 }}
                className="text-6xl mb-4 text-center"
              >
                🎉
              </motion.div>
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-4xl font-bold text-blue-900 text-center font-lexend mb-2"
              >
                Yayyy! You did it!
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-xl text-blue-900 text-center font-opendyslexic"
              >
                Puzzle completed successfully! 🧩✨
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 