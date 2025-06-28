import { useState } from 'react';
import { motion } from 'framer-motion';

export function Community() {
  const roles = ["Patient", "Guardian", "Care-taker"];
  const pastelTabColors = ["bg-pastel-mint", "bg-pastel-lavender", "bg-pastel-pink"];
  const [activeTab, setActiveTab] = useState(0);
  
  // Each role has its own messages
  const [messagesByRole, setMessagesByRole] = useState([
    [
      { id: 1, user: 'Alice', text: 'Welcome to the ReKindle community!' },
      { id: 2, user: 'Bob', text: 'This app is so cheerful and helpful.' },
      { id: 3, user: 'Sam', text: 'My grandma loves the games here.' },
    ],
    [
      { id: 4, user: 'Guardian1', text: "Guardians unite! Let's support each other." },
      { id: 5, user: 'Guardian2', text: 'Tips for daily care are welcome.' },
    ],
    [
      { id: 6, user: 'Care-taker1', text: 'Care-takers, share your stories!' },
      { id: 7, user: 'Care-taker2', text: 'How do you keep patients engaged?' },
    ],
  ]);
  const [newMsg, setNewMsg] = useState("");

  const handlePost = (e) => {
    e.preventDefault();
    if (newMsg.trim()) {
      setMessagesByRole(msgs => msgs.map((arr, idx) => idx === activeTab ? [...arr, { id: Date.now(), user: 'You', text: newMsg }] : arr));
      setNewMsg("");
    }
  };

  return (
    <>
      <motion.h1 
        initial={{ scale: 0.8, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }} 
        transition={{ type: 'spring', stiffness: 120, damping: 8, delay: 0.1 }} 
        className="text-4xl md:text-5xl font-extrabold mb-6 text-blue-900 text-center"
      >
        Community
      </motion.h1>
      <p className="text-xl md:text-2xl mb-6 max-w-xl text-center font-opendyslexic text-blue-900">
        Share, chat, and connect with others in the ReKindle community.
      </p>
      
      {/* Tabs */}
      <div className="flex justify-center mb-6 gap-2">
        {roles.map((role, idx) => (
          <button
            key={role}
            className={`px-6 py-2 rounded-t-2xl font-bold text-blue-900 text-lg shadow focus:outline-none focus:ring-2 focus:ring-pastel-blue transition-all border-b-4 ${activeTab === idx ? pastelTabColors[idx] + ' border-blue-900' : 'bg-white/70 border-transparent hover:bg-pastel-mint/40'}`}
            onClick={() => setActiveTab(idx)}
            aria-selected={activeTab === idx}
            tabIndex={0}
          >
            {role}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="bg-white/80 rounded-2xl shadow-lg p-6 max-w-2xl mx-auto mb-6 max-h-96 overflow-y-auto">
        {messagesByRole[activeTab].map(msg => (
          <div key={msg.id} className="mb-4 p-3 bg-pastel-mint/30 rounded-lg">
            <span className="font-bold text-blue-900">{msg.user}: </span>
            <span className="text-blue-900">{msg.text}</span>
          </div>
        ))}
      </div>

      {/* Post Form */}
      <form onSubmit={handlePost} className="flex gap-2 max-w-2xl mx-auto">
        <input
          type="text"
          value={newMsg}
          onChange={e => setNewMsg(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 rounded-lg px-4 py-2 border-2 border-pastel-mint focus:ring-4 focus:ring-pastel-blue text-lg font-opendyslexic"
        />
        <button 
          type="submit" 
          className="bg-pastel-mint hover:bg-pastel-blue transition-colors text-lg rounded-lg px-6 py-2 font-bold shadow focus:outline-none focus:ring-4 focus:ring-pastel-lavender text-blue-900"
        >
          Post
        </button>
      </form>
    </>
  );
} 