import { memo } from 'react';
import { motion } from 'framer-motion';
import { ReplyTextarea, ReplyCharacterCount } from './InputComponents';

// Isolated Message Component to prevent re-renders
const MessageComponent = memo(({ 
  message, 
  isReply = false, 
  onLike, 
  onReply, 
  onFlag, 
  isReplying, 
  replyText, 
  onReplyTextChange, 
  onReplySubmit, 
  onReplyCancel, 
  loading, 
  loggedIn,
  formatTimestamp,
  isExpanded,
  onToggleExpand
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`mb-4 p-4 rounded-lg shadow-sm ${isReply ? 'ml-6 bg-pastel-lavender/30 border-l-4 border-pastel-lavender' : 'bg-pastel-mint/30 border-l-4 border-pastel-mint'}`}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <span className="font-bold text-blue-900">{message.user}</span>
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
            {message.role}
          </span>
        </div>
        <span className="text-xs text-blue-700" title={new Date(message.timestamp).toLocaleString()}>
          {formatTimestamp(message.timestamp)}
        </span>
      </div>
      
      {!isReply && (
        <button 
          onClick={onToggleExpand}
          className="w-full text-left"
          aria-expanded={isExpanded}
        >
          <p className="text-blue-900 leading-relaxed text-lg font-medium">
            {message.text}
          </p>
        </button>
      )}
      
      {isReply && (
        <p className="text-blue-900 leading-relaxed">
          {message.text}
        </p>
      )}
      
      {/* Action buttons */}
      <div className="flex items-center gap-4 mt-3">
        {loggedIn && (
          <button
            onClick={() => onLike(message.id)}
            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
            aria-label={`Like ${message.user}'s message`}
          >
            <span className="text-lg">{message.isLiked ? '❤️' : '🤍'}</span>
            <span>{message.likeCount || 0}</span>
          </button>
        )}
        
        {!isReply && loggedIn && (
          <button
            onClick={() => onReply(message)}
            className="text-sm text-blue-600 hover:text-blue-800 underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
            aria-label={`Reply to ${message.user}'s message`}
          >
            Reply
          </button>
        )}
        
        {!isReply && message.replies && message.replies.length > 0 && (
          <button
            onClick={onToggleExpand}
            className="text-sm text-blue-600 hover:text-blue-800 underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
          >
            {isExpanded ? 'Hide replies' : `Show replies (${message.replies.length})`}
          </button>
        )}
        
        {loggedIn && (
          <button
            onClick={() => onFlag(message)}
            className="text-sm text-red-600 hover:text-red-800 underline focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
            aria-label={`Flag ${message.user}'s message`}
          >
            Flag
          </button>
        )}
      </div>
      
      {/* Reply form */}
      {isReplying && (
        <motion.form 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          onSubmit={onReplySubmit} 
          className="mt-4 flex gap-2"
        >
          <div className="flex-1">
            <ReplyTextarea
              value={replyText}
              onChange={onReplyTextChange}
              loading={loading}
              placeholder="Type your reply..."
            />
            <ReplyCharacterCount count={replyText.length} max={500} />
          </div>
          <div className="flex flex-col gap-2">
            <button 
              type="submit" 
              disabled={loading || !replyText.trim()}
              className="bg-pastel-blue hover:bg-blue-600 transition-colors text-sm rounded px-3 py-2 font-bold text-white disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {loading ? 'Posting...' : 'Reply'}
            </button>
            <button 
              type="button"
              onClick={onReplyCancel}
              className="bg-gray-400 hover:bg-gray-500 transition-colors text-sm rounded px-3 py-2 font-bold text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
          </div>
        </motion.form>
      )}
      
      {/* Show replies */}
      {isExpanded && message.replies && message.replies.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-4 space-y-3"
        >
          {message.replies.map(reply => (
            <MessageComponent 
              key={reply.id} 
              message={reply} 
              isReply={true}
              onLike={onLike}
              onReply={onReply}
              onFlag={onFlag}
              isReplying={false}
              replyText=""
              onReplyTextChange={() => {}}
              onReplySubmit={() => {}}
              onReplyCancel={() => {}}
              loading={false}
              loggedIn={loggedIn}
              formatTimestamp={formatTimestamp}
              isExpanded={false}
              onToggleExpand={() => {}}
            />
          ))}
        </motion.div>
      )}
    </motion.div>
  );
});

export default MessageComponent; 