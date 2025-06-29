import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

export function FamilyPhotoMatchGame() {
  const navigate = useNavigate();
  const { loggedIn, token } = useAuth();
  const [score, setScore] = useState(0);
  const [gameActive, setGameActive] = useState(true);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [shuffledPhotos, setShuffledPhotos] = useState([]);
  const [shuffledNames, setShuffledNames] = useState([]);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch family members from backend
  useEffect(() => {
    const fetchFamilyMembers = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (!loggedIn) {
          console.log('User not logged in, using fallback family members');
          // Fallback to default family members if not logged in
          const fallbackMembers = [
            { id: 1, name: 'Mom', photo: '/src/assets/mom.png' },
            { id: 2, name: 'Dad', photo: '/src/assets/dad.png' },
            { id: 3, name: 'Sister', photo: '/src/assets/sister.png' },
            { id: 4, name: 'Brother', photo: '/src/assets/brother.png' }
          ];
          setFamilyMembers(fallbackMembers);
          return;
        }
        
        console.log('Fetching guardians for logged in user, token:', token ? 'present' : 'missing');
        
        const response = await fetch('https://rekindle-zyhh.onrender.com/api/guardians', {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        console.log('Guardians response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('Guardians loaded successfully, count:', data.guardians.length);
          
          // Check if we have enough guardians for a good game (need at least 2)
          if (data.guardians.length < 2) {
            console.log('Not enough guardians (less than 2), using fallback family members');
            const fallbackMembers = [
              { id: 1, name: 'Mom', photo: '/src/assets/mom.png' },
              { id: 2, name: 'Dad', photo: '/src/assets/dad.png' },
              { id: 3, name: 'Sister', photo: '/src/assets/sister.png' },
              { id: 4, name: 'Brother', photo: '/src/assets/brother.png' }
            ];
            setFamilyMembers(fallbackMembers);
            return;
          }
          
          // Convert guardians to family members format
          const members = data.guardians.map((guardian, index) => ({
            id: index + 1,
            name: guardian.name || guardian.relationship || `Guardian ${index + 1}`,
            photo: guardian.photo ? `data:${guardian.photo.contentType};base64,${guardian.photo.data}` : `/src/assets/background.jpg`,
            relationship: guardian.relationship
          }));
          
          setFamilyMembers(members);
        } else {
          console.log('Guardians not found, using fallback family members');
          // Fallback to default family members
          const fallbackMembers = [
            { id: 1, name: 'Mom', photo: '/src/assets/mom.png' },
            { id: 2, name: 'Dad', photo: '/src/assets/dad.png' },
            { id: 3, name: 'Sister', photo: '/src/assets/sister.png' },
            { id: 4, name: 'Brother', photo: '/src/assets/brother.png' }
          ];
          setFamilyMembers(fallbackMembers);
        }
      } catch (err) {
        console.error('Error fetching guardians:', err);
        setError('Failed to load family members');
        // Fallback to default family members
        const fallbackMembers = [
          { id: 1, name: 'Mom', photo: '/src/assets/mom.png' },
          { id: 2, name: 'Dad', photo: '/src/assets/dad.png' },
          { id: 3, name: 'Sister', photo: '/src/assets/sister.png' },
          { id: 4, name: 'Brother', photo: '/src/assets/brother.png' }
        ];
        setFamilyMembers(fallbackMembers);
      } finally {
        setLoading(false);
      }
    };

    fetchFamilyMembers();
  }, [loggedIn, token]);

  // Shuffle arrays when family members change
  useEffect(() => {
    if (familyMembers.length > 0) {
      // Create two arrays: one for photos, one for names
      const photos = familyMembers.map(member => ({ ...member, type: 'photo' }));
      const names = familyMembers.map(member => ({ ...member, type: 'name' }));

      // Shuffle both arrays
      const shuffledPhotosArray = [...photos].sort(() => Math.random() - 0.5);
      const shuffledNamesArray = [...names].sort(() => Math.random() - 0.5);

      setShuffledPhotos(shuffledPhotosArray);
      setShuffledNames(shuffledNamesArray);
    }
  }, [familyMembers]);

  const handleItemClick = (item) => {
    if (matchedPairs.includes(item.id)) return; // Already matched
    
    if (selectedItems.length === 0) {
      // First selection
      setSelectedItems([item]);
    } else if (selectedItems.length === 1) {
      // Second selection
      const firstItem = selectedItems[0];
      
      if (firstItem.id === item.id && firstItem.type !== item.type) {
        // Match found! (same family member, different types)
        setMatchedPairs([...matchedPairs, item.id]);
        setScore(score + 10);
        setSelectedItems([]);
        
        // Check if all pairs are matched
        if (matchedPairs.length + 1 === familyMembers.length) {
          setGameActive(false);
        }
      } else {
        // No match
        setScore(Math.max(0, score - 2));
        setSelectedItems([]);
      }
    }
  };

  const isSelected = (item) => {
    return selectedItems.some(selected => selected.id === item.id && selected.type === item.type);
  };

  const isMatched = (item) => {
    return matchedPairs.includes(item.id);
  };

  const resetGame = () => {
    setScore(0);
    setGameActive(true);
    setMatchedPairs([]);
    setSelectedItems([]);
    
    // Re-shuffle arrays for new game
    const photos = familyMembers.map(member => ({ ...member, type: 'photo' }));
    const names = familyMembers.map(member => ({ ...member, type: 'name' }));

    const shuffledPhotosArray = [...photos].sort(() => Math.random() - 0.5);
    const shuffledNamesArray = [...names].sort(() => Math.random() - 0.5);

    setShuffledPhotos(shuffledPhotosArray);
    setShuffledNames(shuffledNamesArray);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-2xl font-bold text-blue-900"
        >
          Loading family members...
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <motion.h1 
        initial={{ scale: 0.8, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }} 
        transition={{ type: 'spring', stiffness: 120, damping: 8, delay: 0.1 }} 
        className="text-4xl md:text-5xl font-extrabold mb-6 text-blue-900 text-center"
      >
        Family Photo Match
      </motion.h1>
      <p className="text-xl md:text-2xl mb-6 max-w-xl text-center font-opendyslexic text-blue-900">
        Match family member photos with their names!
      </p>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="bg-white/80 rounded-2xl shadow-lg p-6 mb-8">
        <div className="flex justify-between items-center">
          <span className="text-xl font-opendyslexic text-blue-900">Score: {score}</span>
          <span className="text-xl font-opendyslexic text-blue-900">
            Matched: {matchedPairs.length}/{familyMembers.length}
          </span>
        </div>
      </div>

      {gameActive ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl">
          {/* Photos Section */}
          <div className="bg-white/80 rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-blue-900 mb-6 font-lexend text-center">
              Family Photos
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {shuffledPhotos.map((member) => (
                <motion.div
                  key={`photo-${member.id}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`bg-white rounded-2xl p-4 cursor-pointer transition-all duration-300 shadow-lg border-2 ${
                    isMatched(member) 
                      ? 'border-green-400 opacity-50' 
                      : isSelected(member)
                      ? 'border-pastel-blue ring-4 ring-pastel-blue'
                      : 'border-gray-300 hover:border-pastel-blue'
                  }`}
                  onClick={() => handleItemClick(member)}
                >
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="w-24 h-24 object-contain mx-auto mb-2"
                  />
                  <p className="text-lg font-bold text-blue-900 font-lexend text-center">
                    {isMatched(member) ? member.name : '???'}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Names Section */}
          <div className="bg-white/80 rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-blue-900 mb-6 font-lexend text-center">
              Family Names
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {shuffledNames.map((member) => (
                <motion.div
                  key={`name-${member.id}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`bg-white rounded-2xl p-4 cursor-pointer transition-all duration-300 shadow-lg border-2 ${
                    isMatched(member) 
                      ? 'border-green-400 opacity-50' 
                      : isSelected(member)
                      ? 'border-pastel-blue ring-4 ring-pastel-blue'
                      : 'border-gray-300 hover:border-pastel-blue'
                  }`}
                  onClick={() => handleItemClick(member)}
                >
                  <div className="w-24 h-24 bg-gray-200 rounded-lg mx-auto mb-2 flex items-center justify-center">
                    <span className="text-4xl">👤</span>
                  </div>
                  <p className="text-lg font-bold text-blue-900 font-lexend text-center">
                    {member.name}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <h2 className="text-3xl font-bold text-blue-900 mb-4 font-lexend">Great Job!</h2>
          <p className="text-xl text-blue-900 mb-6 font-opendyslexic">
            You matched all family members! Final Score: {score}
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