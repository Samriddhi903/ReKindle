import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export function Home() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/login');
  };

  const handleLearnMore = () => {
    navigate('/resources');
  };

  return (
    <>
      <motion.h1 
        initial={{ scale: 0.8, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }} 
        transition={{ type: 'spring', stiffness: 120, damping: 8, delay: 0.1 }} 
        className="text-5xl md:text-6xl font-extrabold mb-6 text-blue-900 drop-shadow-[0_4px_24px_rgba(30,64,175,0.3)] text-center"
      >
        Welcome to ReKindle
      </motion.h1>
      <p className="text-2xl md:text-3xl mb-10 max-w-xl text-center font-opendyslexic text-blue-900">
        A warm, friendly space for memory, connection, and joy. Designed for everyone, especially those with ADHD, dementia, dyslexia, and Alzheimer's.
      </p>
      <div className="flex flex-col md:flex-row gap-6">
        <button 
          onClick={handleGetStarted}
          className="bg-pastel-mint hover:bg-pastel-blue transition-colors text-2xl rounded-full px-8 py-4 font-bold shadow-lg focus:outline-none focus:ring-4 focus:ring-pastel-lavender text-blue-900"
        >
          Get Started
        </button>
        <button 
          onClick={handleLearnMore}
          className="bg-pastel-lavender hover:bg-pastel-pink transition-colors text-2xl rounded-full px-8 py-4 font-bold shadow-lg focus:outline-none focus:ring-4 focus:ring-pastel-mint text-blue-900"
        >
          Learn More
        </button>
      </div>
    </>
  );
} 