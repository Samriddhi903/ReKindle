import { motion } from 'framer-motion';

const FlagModal = ({ 
  showFlagModal, 
  flaggingMessage, 
  flagReason, 
  onFlagReasonChange, 
  onSubmit, 
  onClose 
}) => {
  if (!showFlagModal || !flaggingMessage) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl p-6 max-w-md w-full mx-4"
      >
        <h3 className="text-xl font-bold text-blue-900 mb-4">Flag Message</h3>
        <p className="text-gray-700 mb-4">Why are you flagging this message?</p>
        
        <form onSubmit={onSubmit}>
          <div className="space-y-2 mb-4">
            {['inappropriate', 'spam', 'harassment', 'other'].map(reason => (
              <label key={reason} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="reason"
                  value={reason}
                  checked={flagReason === reason}
                  onChange={onFlagReasonChange}
                  className="text-blue-600"
                />
                <span className="capitalize">{reason}</span>
              </label>
            ))}
          </div>
          
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={!flagReason}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            >
              Flag Message
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default FlagModal; 