import { motion, AnimatePresence } from 'framer-motion';
import MessageComponent from './MessageComponent';

const MessageList = ({ 
  loading, 
  filteredMessages, 
  searchQuery, 
  selectedSubcommunity,
  onLike,
  onReply,
  onFlag,
  replyingTo,
  replyText,
  onReplyTextChange,
  onReplySubmit,
  onReplyCancel,
  loggedIn,
  formatTimestamp,
  expandedMessages,
  onToggleExpand
}) => (
  <div className="bg-white/80 rounded-2xl shadow-lg p-6 max-w-4xl mx-auto mb-6 max-h-[70vh] overflow-y-auto">
    {loading ? (
      <div className="text-center text-blue-900 py-8">
        <div className="animate-spin text-2xl mb-2">🔄</div>
        Loading messages...
      </div>
    ) : filteredMessages.length === 0 ? (
      <div className="text-center text-blue-900 py-8">
        <div className="text-4xl mb-2">
          {searchQuery ? '🔍' : '💬'}
        </div>
        <p className="text-lg">
          {searchQuery 
            ? `No messages found for "${searchQuery}"`
            : `No messages yet in ${selectedSubcommunity.name}.`}
        </p>
        {!searchQuery && (
          <p className="text-sm text-blue-700">Be the first to start a conversation!</p>
        )}
      </div>
    ) : (
      <div className="space-y-4">
        <AnimatePresence>
          {filteredMessages.map(msg => (
            <MessageComponent 
              key={msg.id} 
              message={msg}
              onLike={onLike}
              onReply={onReply}
              onFlag={onFlag}
              isReplying={replyingTo && replyingTo.id === msg.id}
              replyText={replyText}
              onReplyTextChange={onReplyTextChange}
              onReplySubmit={onReplySubmit}
              onReplyCancel={onReplyCancel}
              loading={loading}
              loggedIn={loggedIn}
              formatTimestamp={formatTimestamp}
              isExpanded={expandedMessages[msg.id]}
              onToggleExpand={() => onToggleExpand(msg.id)}
            />
          ))}
        </AnimatePresence>
      </div>
    )}
  </div>
);

export default MessageList; 