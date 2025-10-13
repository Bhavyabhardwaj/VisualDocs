import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Users, Circle } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  avatar?: string;
  status: 'active' | 'idle' | 'offline';
  currentPage?: string;
}

interface TeamPresenceProps {
  members?: TeamMember[];
  maxVisible?: number;
}

export const TeamPresence = ({ members = [], maxVisible = 5 }: TeamPresenceProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const activeMembersCount = members.filter(m => m.status === 'active').length;
  const visibleMembers = isExpanded ? members : members.slice(0, maxVisible);
  const hiddenCount = Math.max(0, members.length - maxVisible);

  const getStatusColor = (status: TeamMember['status']) => {
    switch (status) {
      case 'active':
        return 'bg-success';
      case 'idle':
        return 'bg-warning';
      case 'offline':
        return 'bg-muted-foreground';
    }
  };

  if (members.length === 0) return null;

  return (
    <div className="relative">
      {/* Avatars Stack */}
      <div className="flex items-center">
        <div className="flex -space-x-2">
          {visibleMembers.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, scale: 0.8, x: -10 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="relative group"
            >
              {/* Avatar */}
              <div className="w-8 h-8 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs font-medium cursor-pointer hover:z-10 transition-transform hover:scale-110">
                {member.avatar ? (
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span>{member.name[0]}</span>
                )}
                
                {/* Status Indicator */}
                <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-background ${getStatusColor(member.status)}`} />
              </div>

              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-foreground text-background text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                {member.name}
                {member.currentPage && (
                  <div className="text-muted text-[10px]">
                    {member.currentPage}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* More Members Button */}
        {!isExpanded && hiddenCount > 0 && (
          <button
            onClick={() => setIsExpanded(true)}
            className="ml-2 w-8 h-8 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs font-medium hover:bg-muted/80 transition-colors"
          >
            +{hiddenCount}
          </button>
        )}

        {/* Active Count */}
        <div className="ml-3 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Circle className="h-2 w-2 fill-success text-success animate-pulse" />
          <span>{activeMembersCount} active</span>
        </div>
      </div>

      {/* Expanded Members List */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            className="absolute top-10 left-0 w-64 bg-background border border-border rounded-lg shadow-xl z-50 p-2"
          >
            <div className="flex items-center justify-between mb-2 px-2 py-1">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Users className="h-4 w-4" />
                <span>Team ({members.length})</span>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Close
              </button>
            </div>
            
            <div className="max-h-64 overflow-y-auto space-y-1">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center gap-3 px-2 py-2 rounded hover:bg-muted transition-colors"
                >
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                      {member.avatar ? (
                        <img src={member.avatar} alt={member.name} className="w-full h-full rounded-full" />
                      ) : (
                        member.name[0]
                      )}
                    </div>
                    <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-background ${getStatusColor(member.status)}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{member.name}</div>
                    {member.currentPage && (
                      <div className="text-xs text-muted-foreground truncate">
                        {member.currentPage}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
