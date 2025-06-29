import { motion } from 'framer-motion';
import { PostTextarea, CharacterCount } from './InputComponents';

const PostForm = ({ 
  loggedIn, 
  loading, 
  newMsg, 
  onNewMsgChange, 
  onSubmit, 
  onRefresh, 
  isRefreshing, 
  selectedSubcommunity 
}) => {
  if (!loggedIn) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center text-blue-900 max-w-2xl mx-auto bg-white/80 rounded-2xl shadow-lg p-6"
      >
        <div className="text-4xl mb-2">🔐</div>
        <p className="text-lg font-semibold mb-2">Join the conversation!</p>
        <p>Please log in to post messages in the community.</p>
      </motion.div>
    );
  }

  return (
    <motion.form 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={onSubmit} 
      className="max-w-4xl mx-auto"
    >
      <div className="bg-white/80 rounded-2xl shadow-lg p-6">
        <div className="flex gap-4">
          <div className="flex-1">
            <PostTextarea
              value={newMsg}
              onChange={onNewMsgChange}
              loading={loading}
              placeholder={`Share your thoughts in the ${selectedSubcommunity.name} community...`}
            />
            <CharacterCount count={newMsg.length} max={500} />
          </div>
          <div className="flex flex-col gap-2">
            <button 
              type="submit" 
              disabled={loading || !newMsg.trim()}
              className="bg-pastel-mint hover:bg-pastel-blue transition-colors text-lg rounded-lg px-6 py-3 font-bold shadow focus:outline-none focus:ring-4 focus:ring-pastel-lavender text-blue-900 disabled:opacity-50 whitespace-nowrap"
            >
              {loading ? 'Posting...' : 'Post Message'}
            </button>
            <button 
              type="button"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="bg-gray-200 hover:bg-gray-300 transition-colors text-sm rounded-lg px-4 py-2 font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
            >
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>
      </div>
    </motion.form>
  );
};

export default PostForm; 