import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import happyCat from '../assets/happy cat.png';
import familyPlaceholder from '../assets/background.jpg';

export function Games() {
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
        let url = 'http://localhost:5000/api/family-photo';
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
        }
      } catch (err) {
        console.error('Error fetching family photo for preview:', err);
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
        {/* Add more game cards here in the future */}
      </div>
    </>
  );
} 