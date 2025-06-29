import { motion, AnimatePresence } from 'framer-motion';
import { ReplyTextarea, ReplyCharacterCount } from './InputComponents';

const PostDetail = ({ 
  post, 
  onClose, 
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
  expandedMessages,
  onToggleExpand
}) => {
  if (!post) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white rounded-t-2xl p-6 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-pastel-mint to-pastel-blue rounded-full flex items-center justify-center text-white font-bold text-xl">
                {post.user?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div>
                <h3 className="font-bold text-blue-900 text-xl">{post.user}</h3>
                <span className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                  {post.role}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl focus:outline-none focus:ring-2 focus:ring-gray-500 rounded"
              aria-label="Close post detail"
            >
              ×
            </button>
          </div>
        </div>

        {/* Post Content */}
        <div className="p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-blue-900 mb-4">
              {post.title || 'Untitled Post'}
            </h1>
            <p className="text-blue-700 text-lg leading-relaxed mb-4">
              {post.text}
            </p>
            <div className="flex justify-between items-center text-sm text-gray-500">
              <span title={new Date(post.timestamp).toLocaleString()}>
                {formatTimestamp(post.timestamp)}
              </span>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <span className="text-lg">{post.isLiked ? '❤️' : '🤍'}</span>
                  <span>{post.likeCount || 0}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>💬</span>
                  <span>{post.replies?.length || 0}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {loggedIn && (
            <div className="flex gap-4 mb-6 pb-6 border-b border-gray-200">
              <button
                onClick={() => onLike(post.id)}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-3 py-2"
              >
                <span className="text-lg">{post.isLiked ? '❤️' : '🤍'}</span>
                {post.isLiked ? 'Liked' : 'Like'}
              </button>
              <button
                onClick={() => onReply(post)}
                className="text-blue-600 hover:text-blue-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-3 py-2"
              >
                Reply
              </button>
              <button
                onClick={() => onFlag(post)}
                className="text-red-600 hover:text-red-800 font-semibold focus:outline-none focus:ring-2 focus:ring-red-500 rounded px-3 py-2"
              >
                Flag
              </button>
            </div>
          )}

          {/* Reply Form */}
          {isReplying && (
            <motion.form 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={onReplySubmit} 
              className="mb-6 p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex gap-4">
                <div className="flex-1">
                  <ReplyTextarea
                    value={replyText}
                    onChange={onReplyTextChange}
                    loading={loading}
                    placeholder="Write your reply..."
                  />
                  <ReplyCharacterCount count={replyText.length} max={500} />
                </div>
                <div className="flex flex-col gap-2">
                  <button 
                    type="submit" 
                    disabled={loading || !replyText.trim()}
                    className="bg-pastel-blue hover:bg-blue-600 transition-colors text-sm rounded px-4 py-2 font-bold text-white disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {loading ? 'Posting...' : 'Reply'}
                  </button>
                  <button 
                    type="button"
                    onClick={onReplyCancel}
                    className="bg-gray-400 hover:bg-gray-500 transition-colors text-sm rounded px-4 py-2 font-bold text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.form>
          )}

          {/* Replies Section */}
          <div>
            <h3 className="text-xl font-bold text-blue-900 mb-4">
              Replies ({post.replies?.length || 0})
            </h3>
            
            {post.replies && post.replies.length > 0 ? (
              <div className="space-y-4">
                {post.replies.map(reply => (
                  <motion.div
                    key={reply.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-50 rounded-lg p-4 ml-4 border-l-4 border-pastel-blue"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-blue-900">{reply.user}</span>
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                          {reply.role}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500" title={new Date(reply.timestamp).toLocaleString()}>
                        {formatTimestamp(reply.timestamp)}
                      </span>
                    </div>
                    <p className="text-blue-700 leading-relaxed">{reply.text}</p>
                    
                    {loggedIn && (
                      <div className="flex items-center gap-4 mt-3">
                        <button
                          onClick={() => onLike(reply.id)}
                          className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                        >
                          <span className="text-lg">{reply.isLiked ? '❤️' : '🤍'}</span>
                          <span>{reply.likeCount || 0}</span>
                        </button>
                        <button
                          onClick={() => onFlag(reply)}
                          className="text-sm text-red-600 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
                        >
                          Flag
                        </button>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <div className="text-4xl mb-2">💬</div>
                <p>No replies yet. Be the first to respond!</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PostDetail; 