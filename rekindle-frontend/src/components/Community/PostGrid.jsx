import { motion, AnimatePresence } from 'framer-motion';
import PostCard from './PostCard';

const PostGrid = ({ 
  posts, 
  loading, 
  searchQuery, 
  selectedSubcommunity,
  onCardClick,
  onLike,
  onFlag,
  loggedIn,
  formatTimestamp
}) => (
  <div className="max-w-7xl mx-auto">
    {loading ? (
      <div className="text-center text-blue-900 py-12">
        <div className="animate-spin text-4xl mb-4">🔄</div>
        <p className="text-xl">Loading posts...</p>
      </div>
    ) : posts.length === 0 ? (
      <div className="text-center text-blue-900 py-12">
        <div className="text-6xl mb-4">
          {searchQuery ? '🔍' : '📝'}
        </div>
        <h3 className="text-2xl font-bold mb-2">
          {searchQuery 
            ? `No posts found for "${searchQuery}"`
            : `No posts yet in ${selectedSubcommunity.name}`}
        </h3>
        {!searchQuery && (
          <p className="text-lg text-blue-700">Be the first to create a post!</p>
        )}
      </div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence>
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
            >
              <PostCard
                post={post}
                onCardClick={onCardClick}
                formatTimestamp={formatTimestamp}
                loggedIn={loggedIn}
                onLike={onLike}
                onFlag={onFlag}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    )}
  </div>
);

export default PostGrid; 