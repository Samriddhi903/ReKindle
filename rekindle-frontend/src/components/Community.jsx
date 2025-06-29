import { motion } from 'framer-motion';
import { useCommunityLogic } from './Community/useCommunityLogic';
import SubcommunitiesGrid from './Community/SubcommunitiesGrid';
import CommunityStats from './Community/CommunityStats';
import SearchBar from './Community/SearchBar';
import PostGrid from './Community/PostGrid';
import CreatePostButton from './Community/CreatePostButton';
import CreatePostModal from './Community/CreatePostModal';
import PostDetail from './Community/PostDetail';
import FlagModal from './Community/FlagModal';

export function Community() {
  const {
    // State
    loggedIn,
    roles,
    pastelTabColors,
    textState,
    view,
    selectedSubcommunity,
    subcommunities,
    activeTab,
    loading,
    error,
    replyingTo,
    isRefreshing,
    lastRefresh,
    communityStats,
    showFlagModal,
    flaggingMessage,
    flagReason,
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
    formatTimestamp,
    openCreatePostModal,
    closeCreatePostModal,
    openPostDetail,
    closePostDetail,
    dispatch
  } = useCommunityLogic();

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
      
      {view === 'subcommunities' ? (
        <>
          <p className="text-xl md:text-2xl mb-6 max-w-2xl text-center font-opendyslexic text-blue-900 mx-auto">
            Connect with others who share similar experiences and challenges.
          </p>
          
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 max-w-2xl mx-auto flex items-center gap-2"
            >
              <span className="text-red-500">⚠</span>
              {error}
            </motion.div>
          )}
          
          <SubcommunitiesGrid 
            subcommunities={subcommunities}
            onSelectSubcommunity={selectSubcommunity}
          />
        </>
      ) : (
        <>
          {/* Back button and subcommunity header */}
          <div className="max-w-7xl mx-auto mb-6">
            <button
              onClick={goBackToSubcommunities}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4 font-semibold"
            >
              ← Back to Communities
            </button>
            
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">{selectedSubcommunity.icon}</span>
              <div>
                <h2 className="text-2xl font-bold text-blue-900">{selectedSubcommunity.name}</h2>
                <p className="text-blue-700">{selectedSubcommunity.description}</p>
              </div>
            </div>
          </div>
          
          {/* Community Statistics */}
          <CommunityStats 
            communityStats={communityStats}
            selectedSubcommunity={selectedSubcommunity}
            roles={roles}
            activeTab={activeTab}
          />
          
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 max-w-2xl mx-auto flex items-center gap-2"
            >
              <span className="text-red-500">⚠</span>
              {error}
            </motion.div>
          )}
          
          {/* Refresh indicator */}
          <div className="flex justify-center items-center gap-2 mb-4 text-sm text-blue-700">
            <span>Last updated: {formatTimestamp(lastRefresh)}</span>
            {isRefreshing && <span className="animate-spin">🔄</span>}
          </div>
          
          {/* Tabs */}
          <div className="flex justify-center mb-6 gap-2">
            {roles.map((role, idx) => (
              <button
                key={role}
                className={`px-6 py-3 rounded-t-2xl font-bold text-blue-900 text-lg shadow focus:outline-none focus:ring-2 focus:ring-pastel-blue transition-all border-b-4 ${activeTab === idx ? pastelTabColors[idx] + ' border-blue-900' : 'bg-white/70 border-transparent hover:bg-pastel-mint/40'}`}
                onClick={() => handleTabChange(idx)}
                aria-selected={activeTab === idx}
                tabIndex={0}
              >
                {role}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <SearchBar 
            searchQuery={textState.searchQuery}
            onSearchChange={handleSearchChange}
            onClearSearch={() => dispatch({ type: 'SET_SEARCH_QUERY', payload: '' })}
          />

          {/* Posts Grid */}
          <PostGrid 
            posts={filteredMessages}
            loading={loading}
            searchQuery={textState.searchQuery}
            selectedSubcommunity={selectedSubcommunity}
            onCardClick={openPostDetail}
            onLike={handleLike}
            onFlag={openFlagModal}
            loggedIn={loggedIn}
            formatTimestamp={formatTimestamp}
          />

          {/* Create Post Button */}
          <CreatePostButton 
            onClick={openCreatePostModal}
            disabled={loading}
          />
        </>
      )}

      {/* Create Post Modal */}
      <CreatePostModal 
        isOpen={showCreatePostModal}
        onClose={closeCreatePostModal}
        onSubmit={handlePost}
        title={textState.postTitle}
        body={textState.postBody}
        onTitleChange={handlePostTitleChange}
        onBodyChange={handlePostBodyChange}
        loading={loading}
        selectedSubcommunity={selectedSubcommunity}
      />

      {/* Post Detail Modal */}
      <PostDetail 
        post={selectedPost}
        onClose={closePostDetail}
        onLike={handleLike}
        onReply={startReply}
        onFlag={openFlagModal}
        isReplying={replyingTo && replyingTo.id === selectedPost?.id}
        replyText={textState.replyText}
        onReplyTextChange={handleReplyTextChange}
        onReplySubmit={handleReply}
        onReplyCancel={cancelReply}
        loading={loading}
        loggedIn={loggedIn}
        formatTimestamp={formatTimestamp}
        expandedMessages={{}}
        onToggleExpand={() => {}}
      />

      {/* Flag Modal */}
      <FlagModal 
        showFlagModal={showFlagModal}
        flaggingMessage={flaggingMessage}
        flagReason={flagReason}
        onFlagReasonChange={handleFlagReasonChange}
        onSubmit={handleFlag}
        onClose={closeFlagModal}
      />
    </>
  );
} 