import { motion } from 'framer-motion';
import { PostTextarea, CharacterCount } from './InputComponents';

const CreatePostModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  title, 
  body, 
  onTitleChange, 
  onBodyChange, 
  loading, 
  selectedSubcommunity 
}) => {
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-blue-900">Create New Post</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl focus:outline-none focus:ring-2 focus:ring-gray-500 rounded"
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title Input */}
          <div>
            <label htmlFor="post-title" className="block text-sm font-medium text-blue-900 mb-2">
              Title *
            </label>
            <input
              type="text"
              id="post-title"
              value={title}
              onChange={onTitleChange}
              placeholder="Enter a compelling title for your post..."
              className="w-full rounded-lg px-4 py-3 border-2 border-pastel-mint focus:ring-4 focus:ring-pastel-blue text-lg font-opendyslexic disabled:opacity-50"
              maxLength={100}
              required
              disabled={loading}
            />
            <div className="text-sm text-gray-500 mt-1 text-right">
              {title.length}/100 characters
            </div>
          </div>

          {/* Body Input */}
          <div>
            <label htmlFor="post-body" className="block text-sm font-medium text-blue-900 mb-2">
              Content *
            </label>
            <PostTextarea
              value={body}
              onChange={onBodyChange}
              loading={loading}
              placeholder={`Share your thoughts, experiences, or questions with the ${selectedSubcommunity.name} community...`}
              rows={8}
              maxLength={1000}
              id="post-body"
              name="post-body"
            />
            <CharacterCount count={body.length} max={1000} />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading || !title.trim() || !body.trim()}
              className="flex-1 bg-gradient-to-r from-pastel-mint to-pastel-blue hover:from-pastel-blue hover:to-blue-600 transition-all text-lg rounded-lg px-6 py-3 font-bold text-white disabled:opacity-50 focus:outline-none focus:ring-4 focus:ring-pastel-blue/50"
            >
              {loading ? 'Creating...' : 'Create Post'}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 bg-gray-200 hover:bg-gray-300 transition-colors text-lg rounded-lg px-6 py-3 font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default CreatePostModal; 