import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from './AuthContext';
import familyPlaceholder from '../assets/background.jpg';
import readFallback from '../assets/read.png';
import completePicFallback from '../assets/completepic.png';

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
  const [pieces, setPieces] = useState([]);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [gameComplete, setGameComplete] = useState(false);
  const [moves, setMoves] = useState(0);
  const [familyPhotoUrl, setFamilyPhotoUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasUploadedImage, setHasUploadedImage] = useState(false);
  const { token, userId } = useAuth();
  const fileInputRef = useRef(null);

  // Create puzzle pieces when family photo is loaded
  useEffect(() => {
    if (!familyPhotoUrl) return;

    // Create 9 pieces (3x3 grid)
    const newPieces = [];
    for (let i = 0; i < 9; i++) {
      const row = Math.floor(i / 3);
      const col = i % 3;
      newPieces.push({
        id: i,
        backgroundPosition: `${-col * 150}px ${-row * 150}px`
      });
    }
    
    // Shuffle the pieces
    const shuffledPieces = shuffleArray(newPieces);
    setPieces(shuffledPieces);
    setSelectedPiece(null);
    setGameComplete(false);
    setMoves(0);
  }, [familyPhotoUrl]);

  // Fetch family photo on component mount
  useEffect(() => {
    const fetchFamilyPhoto = async () => {
      if (!userId) return;
      
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/family-photo?userId=${userId}`);
        
        if (response.ok) {
          const data = await response.json();
          if (data.familyPhotoUrl) {
            setFamilyPhotoUrl(data.familyPhotoUrl);
          }
        }
      } catch (error) {
        console.error('Error fetching family photo:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFamilyPhoto();
  }, [userId]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFamilyPhotoUrl(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handlePieceClick = (piece) => {
    if (gameComplete || loading || !familyPhotoUrl) return;
    
    if (!selectedPiece) {
      setSelectedPiece(piece);
    } else {
      // Find the indices of the selected pieces
      const selectedIndex = pieces.findIndex(p => p.id === selectedPiece.id);
      const clickedIndex = pieces.findIndex(p => p.id === piece.id);
      
      if (selectedIndex !== -1 && clickedIndex !== -1) {
        // Create a new array and swap the pieces at their positions
        const newPieces = [...pieces];
        const temp = newPieces[selectedIndex];
        newPieces[selectedIndex] = newPieces[clickedIndex];
        newPieces[clickedIndex] = temp;
        
        setPieces(newPieces);
        setSelectedPiece(null);
        setMoves(moves + 1);
        
        // Check if puzzle is complete
        const isComplete = newPieces.every((p, index) => p.id === index);
        if (isComplete) {
          setGameComplete(true);
        }
      } else {
        setSelectedPiece(null);
      }
    }
  };

  const handleRestart = () => {
    if (!familyPhotoUrl) return;
    
    console.log('Restarting puzzle');
    const newPieces = [];
    for (let i = 0; i < 9; i++) {
      const row = Math.floor(i / 3);
      const col = i % 3;
      newPieces.push({
        id: i,
        backgroundPosition: `${-col * 150}px ${-row * 150}px`
      });
    }
    
    const shuffledPieces = shuffleArray(newPieces);
    console.log('Restarted pieces:', shuffledPieces);
    setPieces(shuffledPieces);
    setSelectedPiece(null);
    setGameComplete(false);
    setMoves(0);
  };

  const handleNewImage = () => {
    setFamilyPhotoUrl(null);
    setHasUploadedImage(false);
    setPieces([]);
    setGameComplete(false);
    setMoves(0);
    setSelectedPiece(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <motion.h1 
        initial={{ scale: 0.8, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }} 
        transition={{ type: 'spring', stiffness: 120, damping: 8, delay: 0.1 }} 
        className="text-4xl md:text-5xl font-extrabold mb-6 text-blue-900 text-center"
      >
        Complete the Family Picture!
      </motion.h1>
      <p className="text-xl md:text-2xl mb-6 max-w-xl text-center font-opendyslexic text-blue-900">
        Upload an image and rearrange the pieces to complete the puzzle! Click two pieces to swap them.
      </p>
      
      {/* Upload Section */}
      {!familyPhotoUrl && (
        <div className="mb-8 text-center">
          <div className="bg-white/80 rounded-2xl shadow-lg p-8 max-w-md mx-auto">
            <h3 className="text-2xl font-bold text-blue-900 mb-4">Upload an Image</h3>
            <p className="text-blue-900 mb-6">Choose an image to create your puzzle</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              onClick={handleUploadClick}
              className="bg-pastel-mint hover:bg-pastel-blue transition-colors text-xl rounded-full px-8 py-4 font-bold shadow-lg focus:outline-none focus:ring-4 focus:ring-pastel-lavender text-blue-900"
            >
              Choose Image
            </button>
            {error && (
              <p className="text-red-600 text-sm mt-4">{error}</p>
            )}
          </div>
        </div>
      )}
      
      {loading && (
        <div className="text-center mb-6">
          <p className="text-xl text-blue-900 mb-4">Creating puzzle...</p>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto"></div>
        </div>
      )}
      
      {familyPhotoUrl && (
        <>
          {/* Game Controls */}
          <div className="mb-6 text-center">
            <p className="text-lg text-blue-900">Moves: {moves}</p>
            {gameComplete && (
              <p className="text-2xl font-bold text-green-600 mt-2">Puzzle Complete!</p>
            )}
            {selectedPiece && (
              <p className="text-sm text-blue-600 mt-2">Selected piece: {selectedPiece.id}</p>
            )}
          </div>
          
          {/* Puzzle Grid */}
          <div className="relative w-[450px] h-[450px] bg-white/60 rounded-2xl shadow-lg p-4">
            <div className="grid grid-cols-3 gap-1 w-full h-full">
              {pieces.map((piece, index) => (
                <div
                  key={`${piece.id}-${index}`}
                  className={`w-[150px] h-[150px] cursor-pointer border-2 transition-all duration-200 ${
                    selectedPiece?.id === piece.id 
                      ? 'border-blue-500 shadow-lg scale-105 ring-4 ring-blue-300' 
                      : 'border-gray-300 hover:border-blue-300 hover:shadow-md'
                  } ${gameComplete ? 'pointer-events-none' : ''}`}
                  style={{
                    backgroundImage: `url(${familyPhotoUrl})`,
                    backgroundPosition: piece.backgroundPosition,
                    backgroundSize: '450px 450px',
                    userSelect: 'none',
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Piece clicked! Index:', index, 'Piece ID:', piece.id);
                    handlePieceClick(piece);
                  }}
                  onMouseDown={(e) => e.preventDefault()}
                  title={`Piece ${piece.id} (Position ${index})`}
                />
              ))}
            </div>
            
            {gameComplete && (
              <div className="absolute inset-0 bg-green-500/20 rounded-2xl flex items-center justify-center">
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-blue-900 mb-4">Congratulations!</h2>
                  <p className="text-xl text-blue-900 mb-6">You completed the puzzle in {moves} moves!</p>
                  <button
                    onClick={handleRestart}
                    className="bg-pastel-mint hover:bg-pastel-blue transition-colors text-2xl rounded-full px-8 py-4 font-bold shadow-lg focus:outline-none focus:ring-4 focus:ring-pastel-lavender text-blue-900"
                  >
                    Play Again
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="mt-6 flex gap-4">
            <button
              onClick={handleRestart}
              className="bg-pastel-lavender hover:bg-pastel-pink transition-colors text-xl rounded-full px-6 py-3 font-bold shadow focus:outline-none focus:ring-4 focus:ring-pastel-blue text-blue-900"
            >
              Restart
            </button>
            <button
              onClick={handleNewImage}
              className="bg-pastel-blue hover:bg-pastel-mint transition-colors text-xl rounded-full px-6 py-3 font-bold shadow focus:outline-none focus:ring-4 focus:ring-pastel-lavender text-blue-900"
            >
              New Image
            </button>
          </div>
        </>
      )}
    </div>
  );
} 