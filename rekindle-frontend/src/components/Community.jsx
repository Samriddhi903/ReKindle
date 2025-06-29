import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from './AuthContext';

export function Community() {
  const { loggedIn, token } = useAuth();
  const roles = ["Patient", "Guardian", "Care-taker"];
  const pastelTabColors = ["bg-pastel-mint", "bg-pastel-lavender", "bg-pastel-pink"];
  const [activeTab, setActiveTab] = useState(0);
  const [messagesByRole, setMessagesByRole] = useState([
    [], // Patient messages
    [], // Guardian messages
    [], // Care-taker messages
  ]);
  const [newMsg, setNewMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");

  // Fetch messages for a specific role
  const fetchMessages = async (role) => {
    try {
      const response = await fetch(`http://localhost:5000/api/messages?role=${role}`);
      if (response.ok) {
        const data = await response.json();
        return data.messages;
      } else {
        console.error('Failed to fetch messages for role:', role);
        return [];
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
      return [];
    }
  };

  // Load messages for all roles
  const loadAllMessages = async () => {
    setLoading(true);
    try {
      const patientMessages = await fetchMessages('Patient');
      const guardianMessages = await fetchMessages('Guardian');
      const careTakerMessages = await fetchMessages('Care-taker');

      setMessagesByRole([patientMessages, guardianMessages, careTakerMessages]);
    } catch (err) {
      console.error('Error loading messages:', err);
      setError('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  // Load messages on component mount
  useEffect(() => {
    loadAllMessages();
  }, []);

  const handlePost = async (e) => {
    e.preventDefault();
    if (!loggedIn) {
      setError('Please log in to post messages');
      return;
    }
    
    if (!newMsg.trim()) {
      setError('Please enter a message');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          text: newMsg.trim(),
          role: roles[activeTab]
        })
      });

      if (response.ok) {
        // Reload messages for the current role
        const updatedMessages = await fetchMessages(roles[activeTab]);
        setMessagesByRole(prev => 
          prev.map((messages, idx) => 
            idx === activeTab ? updatedMessages : messages
          )
        );
        setNewMsg("");
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to post message');
      }
    } catch (err) {
      console.error('Error posting message:', err);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (e) => {
    e.preventDefault();
    if (!loggedIn) {
      setError('Please log in to reply to messages');
      return;
    }
    
    if (!replyText.trim()) {
      setError('Please enter a reply');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          text: replyText.trim(),
          role: roles[activeTab],
          parentMessageId: replyingTo.id
        })
      });

      if (response.ok) {
        // Reload messages for the current role
        const updatedMessages = await fetchMessages(roles[activeTab]);
        setMessagesByRole(prev => 
          prev.map((messages, idx) => 
            idx === activeTab ? updatedMessages : messages
          )
        );
        setReplyText("");
        setReplyingTo(null);
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to post reply');
      }
    } catch (err) {
      console.error('Error posting reply:', err);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (idx) => {
    setActiveTab(idx);
    setError(null);
    setReplyingTo(null);
  };

  const startReply = (message) => {
    setReplyingTo(message);
    setReplyText("");
  };

  const cancelReply = () => {
    setReplyingTo(null);
    setReplyText("");
  };

  const MessageComponent = ({ message, isReply = false }) => (
    <div className={`mb-4 p-3 rounded-lg ${isReply ? 'ml-6 bg-pastel-lavender/30' : 'bg-pastel-mint/30'}`}>
      <div className="flex justify-between items-start mb-1">
        <span className="font-bold text-blue-900">{message.user}</span>
        <span className="text-xs text-blue-700">
          {new Date(message.timestamp).toLocaleDateString()}
        </span>
      </div>
      <span className="text-blue-900">{message.text}</span>
      {!isReply && loggedIn && (
        <button
          onClick={() => startReply(message)}
          className="mt-2 text-sm text-blue-600 hover:text-blue-800 underline"
        >
          Reply
        </button>
      )}
      
      {/* Reply form */}
      {replyingTo && replyingTo.id === message.id && (
        <form onSubmit={handleReply} className="mt-3 flex gap-2">
          <input
            type="text"
            value={replyText}
            onChange={e => setReplyText(e.target.value)}
            placeholder="Type your reply..."
            disabled={loading}
            className="flex-1 rounded px-3 py-1 border border-pastel-blue text-sm font-opendyslexic disabled:opacity-50"
          />
          <button 
            type="submit" 
            disabled={loading || !replyText.trim()}
            className="bg-pastel-blue hover:bg-blue-600 transition-colors text-sm rounded px-3 py-1 font-bold text-white disabled:opacity-50"
          >
            {loading ? 'Posting...' : 'Reply'}
          </button>
          <button 
            type="button"
            onClick={cancelReply}
            className="bg-gray-400 hover:bg-gray-500 transition-colors text-sm rounded px-3 py-1 font-bold text-white"
          >
            Cancel
          </button>
        </form>
      )}
      
      {/* Show replies */}
      {message.replies && message.replies.length > 0 && (
        <div className="mt-3">
          {message.replies.map(reply => (
            <MessageComponent key={reply.id} message={reply} isReply={true} />
          ))}
        </div>
      )}
    </div>
  );

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
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 max-w-2xl mx-auto">
          {error}
        </div>
      )}
      
      {/* Tabs */}
      <div className="flex justify-center mb-6 gap-2">
        {roles.map((role, idx) => (
          <button
            key={role}
            className={`px-6 py-2 rounded-t-2xl font-bold text-blue-900 text-lg shadow focus:outline-none focus:ring-2 focus:ring-pastel-blue transition-all border-b-4 ${activeTab === idx ? pastelTabColors[idx] + ' border-blue-900' : 'bg-white/70 border-transparent hover:bg-pastel-mint/40'}`}
            onClick={() => handleTabChange(idx)}
            aria-selected={activeTab === idx}
            tabIndex={0}
          >
            {role}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="bg-white/80 rounded-2xl shadow-lg p-6 max-w-2xl mx-auto mb-6 max-h-96 overflow-y-auto">
        {loading ? (
          <div className="text-center text-blue-900">Loading messages...</div>
        ) : messagesByRole[activeTab].length === 0 ? (
          <div className="text-center text-blue-900">No messages yet. Be the first to post!</div>
        ) : (
          messagesByRole[activeTab].map(msg => (
            <MessageComponent key={msg.id} message={msg} />
          ))
        )}
      </div>

      {/* Post Form */}
      {loggedIn ? (
        <form onSubmit={handlePost} className="flex gap-2 max-w-2xl mx-auto">
          <input
            type="text"
            value={newMsg}
            onChange={e => setNewMsg(e.target.value)}
            placeholder="Type your message..."
            disabled={loading}
            className="flex-1 rounded-lg px-4 py-2 border-2 border-pastel-mint focus:ring-4 focus:ring-pastel-blue text-lg font-opendyslexic disabled:opacity-50"
          />
          <button 
            type="submit" 
            disabled={loading || !newMsg.trim()}
            className="bg-pastel-mint hover:bg-pastel-blue transition-colors text-lg rounded-lg px-6 py-2 font-bold shadow focus:outline-none focus:ring-4 focus:ring-pastel-lavender text-blue-900 disabled:opacity-50"
          >
            {loading ? 'Posting...' : 'Post'}
          </button>
        </form>
      ) : (
        <div className="text-center text-blue-900 max-w-2xl mx-auto">
          <p>Please log in to post messages in the community.</p>
        </div>
      )}
    </>
  );
} 