import { motion } from 'framer-motion';

const SubcommunitiesGrid = ({ subcommunities, onSelectSubcommunity }) => (
  <div className="max-w-6xl mx-auto">
    <motion.h2 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-2xl font-bold text-blue-900 mb-6 text-center"
    >
      Choose a Community
    </motion.h2>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {subcommunities.map((subcommunity, index) => (
        <motion.div
          key={subcommunity.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          onClick={() => onSelectSubcommunity(subcommunity)}
          className="bg-white/80 rounded-2xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-transparent hover:border-pastel-blue"
        >
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">{subcommunity.icon}</span>
            <div>
              <h3 className="text-lg font-bold text-blue-900">{subcommunity.name}</h3>
              <span className={`text-xs px-2 py-1 rounded-full ${subcommunity.color}`}>
                {subcommunity.messageCount} posts • {subcommunity.userCount} members
              </span>
            </div>
          </div>
          <p className="text-blue-700 text-sm leading-relaxed">
            {subcommunity.description}
          </p>
        </motion.div>
      ))}
    </div>
  </div>
);

export default SubcommunitiesGrid; 