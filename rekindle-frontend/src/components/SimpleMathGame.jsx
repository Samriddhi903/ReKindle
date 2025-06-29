import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export function SimpleMathGame() {
  const navigate = useNavigate();
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

  useEffect(() => {
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
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <motion.h1 
        initial={{ scale: 0.8, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }} 
        transition={{ type: 'spring', stiffness: 120, damping: 8, delay: 0.1 }} 
        className="text-4xl md:text-5xl font-extrabold mb-6 text-blue-900 text-center"
      >
        Simple Math
      </motion.h1>
      <p className="text-xl md:text-2xl mb-6 max-w-xl text-center font-opendyslexic text-blue-900">
        Solve easy addition and subtraction problems!
      </p>
      
      <div className="bg-white/80 rounded-2xl shadow-lg p-6 mb-8">
        <span className="text-2xl font-opendyslexic text-blue-900">Score: {score}</span>
      </div>

      {currentProblem && (
        <div className="bg-white/80 rounded-2xl shadow-lg p-8 max-w-md">
          <h2 className="text-3xl font-bold text-blue-900 mb-6 font-lexend text-center">
            What is {currentProblem.num1} {currentProblem.operation} {currentProblem.num2}?
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="number"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              className="text-3xl text-center w-32 h-16 border-4 border-gray-300 rounded-2xl font-opendyslexic focus:border-pastel-blue focus:outline-none mx-auto block"
              placeholder="?"
              autoFocus
            />
            <br />
            <button
              type="submit"
              className="bg-pastel-mint hover:bg-pastel-blue transition-colors text-2xl rounded-full px-8 py-4 font-bold shadow-lg focus:outline-none focus:ring-4 focus:ring-pastel-lavender text-blue-900"
            >
              Check Answer
            </button>
          </form>

          {showFeedback && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 text-2xl font-bold font-opendyslexic text-center"
            >
              {feedback}
            </motion.div>
          )}
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