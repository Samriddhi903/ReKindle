import { motion } from 'framer-motion';

const CommunityStats = ({ communityStats, selectedSubcommunity, roles, activeTab }) => {
  if (!communityStats) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 rounded-2xl shadow-lg p-6 mb-6 max-w-4xl mx-auto"
    >
      <h3 className="text-xl font-bold text-blue-900 mb-4 text-center">
        {selectedSubcommunity ? `${selectedSubcommunity.name} Statistics` : 'Community Statistics'}
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{communityStats.totalMessages}</div>
          <div className="text-sm text-blue-700">Total Messages</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{communityStats.totalReplies}</div>
          <div className="text-sm text-blue-700">Total Replies</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">{communityStats.totalUsers}</div>
          <div className="text-sm text-blue-700">Active Users</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">
            {communityStats.roleStats?.find(s => s.role === roles[activeTab])?.count || 0}
          </div>
          <div className="text-sm text-blue-700">{roles[activeTab]} Messages</div>
        </div>
      </div>
    </motion.div>
  );
};

export default CommunityStats; 