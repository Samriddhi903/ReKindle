import { useState, useEffect, useCallback, useMemo, useReducer } from 'react';
import { useAuth } from '../AuthContext';

// Reducer for text input state
const textReducer = (state, action) => {
  switch (action.type) {
    case 'SET_NEW_MSG':
      return { ...state, newMsg: action.payload };
    case 'SET_REPLY_TEXT':
      return { ...state, replyText: action.payload };
    case 'SET_POST_TITLE':
      return { ...state, postTitle: action.payload };
    case 'SET_POST_BODY':
      return { ...state, postBody: action.payload };
    case 'CLEAR_NEW_MSG':
      return { ...state, newMsg: '' };
    case 'CLEAR_REPLY_TEXT':
      return { ...state, replyText: '' };
    case 'CLEAR_POST_FORM':
      return { ...state, postTitle: '', postBody: '' };
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    default:
      return state;
  }
};

export const useCommunityLogic = () => {
  const { loggedIn, token } = useAuth();
  const roles = ["Patient", "Guardian", "Care-taker"];
  const pastelTabColors = ["bg-pastel-mint", "bg-pastel-lavender", "bg-pastel-pink"];
  
  // Use reducer for text inputs
  const [textState, dispatch] = useReducer(textReducer, {
    newMsg: '',
    replyText: '',
    postTitle: '',
    postBody: '',
    searchQuery: ''
  });
  
  // State management for subcommunities
  const [view, setView] = useState('subcommunities'); // 'subcommunities' or 'messages'
  const [selectedSubcommunity, setSelectedSubcommunity] = useState(null);
  const [subcommunities, setSubcommunities] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [communityStats, setCommunityStats] = useState(null);
  const [showFlagModal, setShowFlagModal] = useState(false);
  const [flaggingMessage, setFlaggingMessage] = useState(null);
  const [flagReason, setFlagReason] = useState('');
  const [expandedMessages, setExpandedMessages] = useState({});
  
  // New state for post cards and modals
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showPostDetail, setShowPostDetail] = useState(false);

  // Filter messages based on search query
  const filteredMessages = useMemo(() => {
    if (!textState.searchQuery) return messages;
    
    const query = textState.searchQuery.toLowerCase();
    return messages.filter(message => {
      const matchesTitle = (message.title || '').toLowerCase().includes(query);
      const matchesMain = message.text.toLowerCase().includes(query);
      const matchesReplies = message.replies?.some(reply => 
        reply.text.toLowerCase().includes(query)
      );
      return matchesTitle || matchesMain || matchesReplies;
    });
  }, [messages, textState.searchQuery]);

  // Load subcommunities
  const loadSubcommunities = useCallback(async () => {
    try {
      const response = await fetch('https://rekindle-zyhh.onrender.com/api/subcommunities');
      if (response.ok) {
        const data = await response.json();
        setSubcommunities(data.subcommunities);
      }
    } catch (err) {
      console.error('Error loading subcommunities:', err);
      setError('Failed to load subcommunities');
    }
  }, []);

  // Load community statistics
  const loadCommunityStats = useCallback(async (subcommunity = null) => {
    try {
      const url = subcommunity 
        ? `https://rekindle-zyhh.onrender.com/api/community/stats?subcommunity=${subcommunity}`
        : 'https://rekindle-zyhh.onrender.com/api/community/stats';
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setCommunityStats(data);
      }
    } catch (err) {
      console.error('Error loading community stats:', err);
    }
  }, []);

  // Fetch messages for a specific subcommunity and role
  const fetchMessages = useCallback(async (subcommunity, role = null) => {
    try {
      let url = `https://rekindle-zyhh.onrender.com/api/messages?subcommunity=${subcommunity}`;
      if (role) {
        url += `&role=${role}`;
      }
      
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        return data.messages;
      } else {
        console.error('Failed to fetch messages');
        return [];
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
      return [];
    }
  }, []);

  // Load messages for current subcommunity
  const loadMessages = useCallback(async () => {
    if (!selectedSubcommunity) return;
    
    setIsRefreshing(true);
    try {
      const messages = await fetchMessages(selectedSubcommunity.id);
      setMessages(messages);
      setLastRefresh(new Date());
      // Reset expanded messages when loading new messages
      setExpandedMessages({});
    } catch (err) {
      console.error('Error loading messages:', err);
      setError('Failed to load messages');
    } finally {
      setIsRefreshing(false);
    }
  }, [selectedSubcommunity, fetchMessages]);

  // Load subcommunities on component mount
  useEffect(() => {
    loadSubcommunities();
    loadCommunityStats();
  }, []);

  // Load messages when subcommunity changes
  useEffect(() => {
    if (selectedSubcommunity) {
      loadMessages();
      loadCommunityStats(selectedSubcommunity.id);
    }
  }, [selectedSubcommunity?.id]);

  const handlePost = useCallback(async (e) => {
    e.preventDefault();
    if (!loggedIn) {
      setError('Please log in to post messages');
      return;
    }
    
    if (!textState.postTitle.trim()) {
      setError('Please enter a title for your post');
      return;
    }

    if (!textState.postBody.trim()) {
      setError('Please enter content for your post');
      return;
    }

    if (textState.postTitle.length > 100) {
      setError('Title is too long. Please keep it under 100 characters.');
      return;
    }

    if (textState.postBody.length > 1000) {
      setError('Content is too long. Please keep it under 1000 characters.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('https://rekindle-zyhh.onrender.com/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: textState.postTitle.trim(),
          text: textState.postBody.trim(),
          role: roles[activeTab],
          subcommunity: selectedSubcommunity.id
        })
      });

      if (response.ok) {
        const updatedMessages = await fetchMessages(selectedSubcommunity.id);
        setMessages(updatedMessages);
        dispatch({ type: 'CLEAR_POST_FORM' });
        setShowCreatePostModal(false);
        loadCommunityStats(selectedSubcommunity.id);
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
  }, [loggedIn, token, roles, activeTab, selectedSubcommunity, fetchMessages, loadCommunityStats, textState.postTitle, textState.postBody]);

  const handleReply = useCallback(async (e) => {
    e.preventDefault();
    if (!loggedIn) {
      setError('Please log in to reply to messages');
      return;
    }
    
    if (!textState.replyText.trim()) {
      setError('Please enter a reply');
      return;
    }

    if (textState.replyText.length > 500) {
      setError('Reply is too long. Please keep it under 500 characters.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('https://rekindle-zyhh.onrender.com/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          text: textState.replyText.trim(),
          role: roles[activeTab],
          subcommunity: selectedSubcommunity.id,
          parentMessageId: replyingTo.id
        })
      });

      if (response.ok) {
        const updatedMessages = await fetchMessages(selectedSubcommunity.id);
        setMessages(updatedMessages);
        dispatch({ type: 'CLEAR_REPLY_TEXT' });
        setReplyingTo(null);
        loadCommunityStats(selectedSubcommunity.id);
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
  }, [loggedIn, token, roles, activeTab, selectedSubcommunity, replyingTo, fetchMessages, loadCommunityStats, textState.replyText]);

  const handleLike = useCallback(async (messageId) => {
    if (!loggedIn) {
      setError('Please log in to like messages');
      return;
    }

    try {
      const response = await fetch(`https://rekindle-zyhh.onrender.com/api/messages/${messageId}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const updatedMessages = await fetchMessages(selectedSubcommunity.id);
        setMessages(updatedMessages);
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to like message');
      }
    } catch (err) {
      console.error('Error liking message:', err);
      setError('Network error. Please try again.');
    }
  }, [loggedIn, token, selectedSubcommunity, fetchMessages]);

  const handleFlag = useCallback(async (e) => {
    e.preventDefault();
    if (!loggedIn) {
      setError('Please log in to flag messages');
      return;
    }

    if (!flagReason) {
      setError('Please select a reason for flagging');
      return;
    }

    try {
      const response = await fetch(`https://rekindle-zyhh.onrender.com/api/messages/${flaggingMessage.id}/flag`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ reason: flagReason })
      });

      if (response.ok) {
        setShowFlagModal(false);
        setFlaggingMessage(null);
        setFlagReason('');
        setError(null);
        const updatedMessages = await fetchMessages(selectedSubcommunity.id);
        setMessages(updatedMessages);
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to flag message');
      }
    } catch (err) {
      console.error('Error flagging message:', err);
      setError('Network error. Please try again.');
    }
  }, [loggedIn, flagReason, flaggingMessage, token, selectedSubcommunity, fetchMessages]);

  const handleTabChange = useCallback((idx) => {
    setActiveTab(idx);
    setError(null);
    setReplyingTo(null);
  }, []);

  const startReply = useCallback((message) => {
    setReplyingTo(message);
    dispatch({ type: 'CLEAR_REPLY_TEXT' });
  }, []);

  const cancelReply = useCallback(() => {
    setReplyingTo(null);
    dispatch({ type: 'CLEAR_REPLY_TEXT' });
  }, []);

  const openFlagModal = useCallback((message) => {
    setFlaggingMessage(message);
    setShowFlagModal(true);
    setFlagReason('');
  }, []);

  const closeFlagModal = useCallback(() => {
    setShowFlagModal(false);
    setFlaggingMessage(null);
    setFlagReason('');
  }, []);

  const selectSubcommunity = useCallback((subcommunity) => {
    setSelectedSubcommunity(subcommunity);
    setView('messages');
    setActiveTab(0);
    setError(null);
    setReplyingTo(null);
  }, []);

  const goBackToSubcommunities = useCallback(() => {
    setView('subcommunities');
    setSelectedSubcommunity(null);
    setMessages([]);
    setError(null);
  }, []);

  const handleReplyTextChange = useCallback((e) => {
    const newValue = e.target.value;
    dispatch({ type: 'SET_REPLY_TEXT', payload: newValue });
  }, []);

  const handlePostTitleChange = useCallback((e) => {
    const newValue = e.target.value;
    dispatch({ type: 'SET_POST_TITLE', payload: newValue });
  }, []);

  const handlePostBodyChange = useCallback((e) => {
    const newValue = e.target.value;
    dispatch({ type: 'SET_POST_BODY', payload: newValue });
  }, []);

  const handleSearchChange = useCallback((e) => {
    const newValue = e.target.value;
    dispatch({ type: 'SET_SEARCH_QUERY', payload: newValue });
  }, []);

  const handleRefresh = useCallback(() => {
    loadMessages();
  }, [loadMessages]);

  const handleFlagReasonChange = useCallback((e) => {
    setFlagReason(e.target.value);
  }, []);

  const toggleMessageExpand = useCallback((messageId) => {
    setExpandedMessages(prev => ({
      ...prev,
      [messageId]: !prev[messageId]
    }));
  }, []);

  const formatTimestamp = useCallback((timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  }, []);

  // New handlers for post cards
  const openCreatePostModal = useCallback(() => {
    setShowCreatePostModal(true);
    dispatch({ type: 'CLEAR_POST_FORM' });
  }, []);

  const closeCreatePostModal = useCallback(() => {
    setShowCreatePostModal(false);
    dispatch({ type: 'CLEAR_POST_FORM' });
  }, []);

  const openPostDetail = useCallback((post) => {
    setSelectedPost(post);
    setShowPostDetail(true);
  }, []);

  const closePostDetail = useCallback(() => {
    setSelectedPost(null);
    setShowPostDetail(false);
    setReplyingTo(null);
  }, []);

  return {
    // State
    loggedIn,
    roles,
    pastelTabColors,
    textState,
    view,
    selectedSubcommunity,
    subcommunities,
    activeTab,
    messages,
    loading,
    error,
    replyingTo,
    isRefreshing,
    lastRefresh,
    communityStats,
    showFlagModal,
    flaggingMessage,
    flagReason,
    expandedMessages,
    filteredMessages,
    showCreatePostModal,
    selectedPost,
    showPostDetail,
    
    // Actions
    handlePost,
    handleReply,
    handleLike,
    handleFlag,
    handleTabChange,
    startReply,
    cancelReply,
    openFlagModal,
    closeFlagModal,
    selectSubcommunity,
    goBackToSubcommunities,
    handleReplyTextChange,
    handlePostTitleChange,
    handlePostBodyChange,
    handleSearchChange,
    handleRefresh,
    handleFlagReasonChange,
    toggleMessageExpand,
    formatTimestamp,
    openCreatePostModal,
    closeCreatePostModal,
    openPostDetail,
    closePostDetail,
    dispatch
  };
}; 