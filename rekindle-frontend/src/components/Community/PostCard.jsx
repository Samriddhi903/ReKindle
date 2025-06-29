import { motion } from 'framer-motion';

const PostCard = ({ 
  post, 
  onCardClick, 
  formatTimestamp,
  loggedIn,
  onLike,
  onFlag
}) => {
  const handleLike = (e) => {
    e.stopPropagation();
    onLike(post.id);
  };

  const handleFlag = (e) => {
    e.stopPropagation();
    onFlag(post);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02, y: -5 }}
      transition={{ duration: 0.2 }}
      onClick={() => onCardClick(post)}
      className="bg-white rounded-2xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-pastel-blue min-h-[200px] flex flex-col"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-pastel-mint to-pastel-blue rounded-full flex items-center justify-center text-white font-bold text-lg">
            {post.user?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div>
            <h3 className="font-bold text-blue-900 text-lg">{post.user}</h3>
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
              {post.role}
            </span>
          </div>
        </div>
        <span className="text-xs text-gray-500" title={new Date(post.timestamp).toLocaleString()}>
          {formatTimestamp(post.timestamp)}
        </span>
      </div>

      {/* Title */}
      <h2 className="text-xl font-bold text-blue-900 mb-3 line-clamp-2">
        {post.title || 'Untitled Post'}
      </h2>

      {/* Preview of body */}
      <p className="text-blue-700 text-sm leading-relaxed flex-grow line-clamp-3">
        {post.text}
      </p>

      {/* Footer with stats and actions */}
      <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <span className="text-lg">{post.isLiked ? '❤️' : '🤍'}</span>
            <span>{post.likeCount || 0}</span>
          </div>
          <div className="flex items-center gap-1">
            <span>💬</span>
            <span>{post.replies?.length || 0}</span>
          </div>
        </div>
        
        {loggedIn && (
          <div className="flex gap-2">
            <button
              onClick={handleLike}
              className="text-blue-600 hover:text-blue-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
              aria-label={`Like ${post.user}'s post`}
            >
              Like
            </button>
            <button
              onClick={handleFlag}
              className="text-red-600 hover:text-red-800 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 rounded px-2 py-1"
              aria-label={`Flag ${post.user}'s post`}
            >
              Flag
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default PostCard; 