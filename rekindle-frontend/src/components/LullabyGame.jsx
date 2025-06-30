import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const stories = [
  {
    title: 'The Brave Little Cloud',
   
  },
  {
    title: 'Finley the Forgetful Fox',
    
  },
  {
    title: 'Zaras Colorful Glasses',
  },
    
  {
    title: 'Milo and the Music in the Wind',
  },
    
  {
    title: 'The Turtle Who Raced the Light',
    
  }
];

const LullabyGame = () => {
  const [selectedStory, setSelectedStory] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const navigate = useNavigate();
  let utterance = null;

  const startGame = () => {
    setIsPlaying(true);
  };

  const stopGame = () => {
    setIsPlaying(false);
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  };

  const playStory = () => {
    if (selectedStory && window.speechSynthesis) {
      stopGame(); // Stop any ongoing speech
      utterance = new window.SpeechSynthesisUtterance(selectedStory.text);
      utterance.onend = () => setIsPlaying(false);
      setIsPlaying(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="relative">
      <div className="absolute inset-0 z-0"></div>
      <div className="relative max-w-2xl text-center bg-white bg-opacity-70 rounded-lg p-8 text-gray-900 z-10">
        <motion.h1
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 120, damping: 8, delay: 0.1 }}
          className="text-4xl md:text-5xl font-extrabold mb-6 text-blue-900 text-center font-['Lexend']"
        >
          Story Time!
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-xl md:text-2xl mb-6 max-w-xl text-center font-opendyslexic text-blue-900"
        >
          Ask Reva to read a bedtime story for you!
        </motion.p>
        <div className="mb-8">
          <div className="flex flex-col gap-3 items-center">
            {stories.map((story, idx) => (
              <button
                key={story.title}
                onClick={() => { setSelectedStory(story); stopGame(); }}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors w-full max-w-xs ${selectedStory && selectedStory.title === story.title ? 'bg-pastel-pink text-blue-900' : 'bg-pastel-blue text-blue-900 hover:bg-pastel-pink'}`}
              >
                {`${idx + 1}. ${story.title}`}
              </button>
            ))}
          </div>
        </div>
        {selectedStory && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2 text-blue-900">{selectedStory.title}</h2>
            <p className="mb-4 text-lg text-gray-800">{selectedStory.text}</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={playStory}
                disabled={isPlaying}
                className="bg-pastel-blue hover:bg-pastel-pink text-blue-900 font-bold px-6 py-2 rounded-full shadow disabled:opacity-50"
              >
                ▶ Play
              </button>
              <button
                onClick={stopGame}
                disabled={!isPlaying}
                className="bg-pastel-pink hover:bg-pastel-blue text-blue-900 font-bold px-6 py-2 rounded-full shadow disabled:opacity-50"
              >
                ■ Stop
              </button>
            </div>
          </div>
        )}
        <button
          onClick={() => { stopGame(); navigate('/games'); }}
          className="mt-8 bg-pastel-lavender hover:bg-pastel-pink transition-colors text-xl rounded-full px-6 py-3 font-bold shadow focus:outline-none focus:ring-4 focus:ring-pastel-blue text-blue-900"
        >
          ← Back to Games
        </button>
      </div>
    </div>
  );
};

export default LullabyGame;