import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, UserPlus, Search, MoreHorizontal, Crown, Shield,
  User, Mail, Calendar, Activity, Trash2, Settings, X, Check
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSocket } from '@/hooks/useSocket';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  avatar?: string;
  status: 'online' | 'away' | 'offline';
  joinedAt: string;
  lastActive: string;
  projectsCount: number;
  commentsCount: number;
}

export default function TeamManagement() {
  const navigate = useNavigate();
  const socket = useSocket();
  const [searchQuery, setSearchQuery] = useState('');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  
  // Mock team data - replace with real API
  const [members, setMembers] = useState<TeamMember[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'owner',
      status: 'online',
      joinedAt: '2024-01-15',
      lastActive: 'Just now',
      projectsCount: 12,
      commentsCount: 145
    },
    {
      id: '2',
      name: 'Sarah Chen',
      email: 'sarah@example.com',
      role: 'admin',
      status: 'online',
      joinedAt: '2024-02-20',
      lastActive: '5 min ago',
      projectsCount: 8,
      commentsCount: 89
    },
    {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike@example.com',
      role: 'member',
      status: 'away',
      joinedAt: '2024-03-10',
      lastActive: '2 hours ago',
      projectsCount: 5,
      commentsCount: 67
    },
    {
      id: '4',
      name: 'Emma Wilson',
      email: 'emma@example.com',
      role: 'member',
      status: 'offline',
      joinedAt: '2024-03-25',
      lastActive: '1 day ago',
      projectsCount: 3,
      commentsCount: 34
    }
  ]);

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: members.length,
    online: members.filter(m => m.status === 'online').length,
    admins: members.filter(m => m.role === 'admin' || m.role === 'owner').length,
    active: members.filter(m => m.lastActive.includes('min') || m.lastActive.includes('Just')).length
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-['Inter']">
      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 h-14 bg-white border-b border-neutral-200 z-50">
        <div className="h-full px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/app/dashboard')}
              className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-neutral-100 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-neutral-600" />
            </button>
            <h1 className="text-sm font-semibold text-neutral-900">Team</h1>
          </div>

          <button
            onClick={() => setShowInviteModal(true)}
            className="px-3 py-1.5 bg-neutral-900 text-white text-sm font-medium rounded-md hover:bg-neutral-800 transition-colors flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            Invite Member
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-14 px-6 pb-8">
        <div className="max-w-6xl mx-auto space-y-6 mt-6">
          
          {/* Stats */}
          <div className="grid grid-cols-4 gap-4">
            <StatCard title="Total Members" value={stats.total} icon={<User className="w-4 h-4" />} />
            <StatCard title="Online Now" value={stats.online} icon={<Activity className="w-4 h-4" />} color="text-green-600" />
            <StatCard title="Admins" value={stats.admins} icon={<Shield className="w-4 h-4" />} />
            <StatCard title="Active Today" value={stats.active} icon={<Calendar className="w-4 h-4" />} />
          </div>

          {/* Search */}
          <div className="bg-white rounded-lg border border-neutral-200 p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-neutral-50 border-0 rounded-md text-sm focus:bg-white focus:ring-1 focus:ring-neutral-300"
              />
            </div>
          </div>

          {/* Members List */}
          <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50 border-b border-neutral-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Member
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Activity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {filteredMembers.map((member, index) => (
                    <MemberRow
                      key={member.id}
                      member={member}
                      index={index}
                      onSelect={setSelectedMember}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Invite Modal */}
      <InviteModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
      />

      {/* Member Detail Modal */}
      <AnimatePresence>
        {selectedMember && (
          <MemberDetailModal
            member={selectedMember}
            onClose={() => setSelectedMember(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// Stat Card
function StatCard({ 
  title, 
  value, 
  icon, 
  color = "text-neutral-600" 
}: { 
  title: string; 
  value: number; 
  icon: React.ReactNode;
  color?: string;
}) {
  return (
    <div className="bg-white rounded-lg border border-neutral-200 p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-neutral-500">{title}</span>
        <div className={color}>{icon}</div>
      </div>
      <div className="text-2xl font-semibold text-neutral-900">{value}</div>
    </div>
  );
}

// Member Row
function MemberRow({ 
  member, 
  index,
  onSelect 
}: { 
  member: TeamMember; 
  index: number;
  onSelect: (member: TeamMember) => void;
}) {
  const [showMenu, setShowMenu] = useState(false);

  const getRoleIcon = () => {
    switch (member.role) {
      case 'owner':
        return <Crown className="w-4 h-4 text-yellow-600" />;
      case 'admin':
        return <Shield className="w-4 h-4 text-blue-600" />;
      default:
        return <User className="w-4 h-4 text-neutral-600" />;
    }
  };

  const getStatusColor = () => {
    switch (member.status) {
      case 'online':
        return 'bg-green-500';
      case 'away':
        return 'bg-yellow-500';
      default:
        return 'bg-neutral-300';
    }
  };

  return (
    <motion.tr
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="hover:bg-neutral-50 transition-colors"
    >
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-sm font-medium text-white">
              {member.name.charAt(0)}
            </div>
            <div className={cn("absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white", getStatusColor())}></div>
          </div>
          <div>
            <div className="text-sm font-medium text-neutral-900">{member.name}</div>
            <div className="text-xs text-neutral-500">{member.email}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2">
          {getRoleIcon()}
          <span className="text-sm text-neutral-900 capitalize">{member.role}</span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={cn(
          "px-2 py-1 text-xs font-medium rounded-full",
          member.status === 'online' && "bg-green-50 text-green-700",
          member.status === 'away' && "bg-yellow-50 text-yellow-700",
          member.status === 'offline' && "bg-neutral-100 text-neutral-600"
        )}>
          {member.status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-neutral-900">{member.projectsCount} projects</div>
        <div className="text-xs text-neutral-500">{member.commentsCount} comments</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
        {new Date(member.joinedAt).toLocaleDateString()}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right relative">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-neutral-100 transition-colors"
        >
          <MoreHorizontal className="w-4 h-4 text-neutral-600" />
        </button>
        
        <AnimatePresence>
          {showMenu && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute right-0 top-12 w-48 bg-white rounded-md shadow-lg border border-neutral-200 py-1 z-10"
            >
              <button
                onClick={() => {
                  onSelect(member);
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-50 flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                View Profile
              </button>
              <button className="w-full px-4 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-50 flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Change Role
              </button>
              {member.role !== 'owner' && (
                <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                  <Trash2 className="w-4 h-4" />
                  Remove
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </td>
    </motion.tr>
  );
}

// Invite Modal
function InviteModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'admin' | 'member' | 'viewer'>('member');

  const handleInvite = () => {
    // Handle invitation
    console.log('Inviting:', email, role);
    setEmail('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-lg p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-neutral-900">Invite Team Member</h3>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-neutral-100 transition-colors"
              >
                <X className="w-4 h-4 text-neutral-600" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="colleague@company.com"
                  className="w-full px-3 py-2 border border-neutral-200 rounded-md focus:ring-1 focus:ring-neutral-300 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full px-3 py-2 border border-neutral-200 rounded-md focus:ring-1 focus:ring-neutral-300 focus:border-transparent"
                >
                  <option value="viewer">Viewer</option>
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-neutral-700 hover:bg-neutral-100 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleInvite}
                  disabled={!email}
                  className="px-4 py-2 bg-neutral-900 text-white rounded-md hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Send Invite
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Member Detail Modal
function MemberDetailModal({ member, onClose }: { member: TeamMember; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg p-6 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-neutral-900">Member Details</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-neutral-100 transition-colors"
          >
            <X className="w-4 h-4 text-neutral-600" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-2xl font-medium text-white">
              {member.name.charAt(0)}
            </div>
            <div>
              <div className="text-lg font-semibold text-neutral-900">{member.name}</div>
              <div className="text-sm text-neutral-600">{member.email}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-neutral-50 rounded-lg">
              <div className="text-xs text-neutral-500 mb-1">Projects</div>
              <div className="text-2xl font-semibold text-neutral-900">{member.projectsCount}</div>
            </div>
            <div className="p-4 bg-neutral-50 rounded-lg">
              <div className="text-xs text-neutral-500 mb-1">Comments</div>
              <div className="text-2xl font-semibold text-neutral-900">{member.commentsCount}</div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-600">Role</span>
              <span className="text-sm font-medium text-neutral-900 capitalize">{member.role}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-600">Status</span>
              <span className="text-sm font-medium text-neutral-900 capitalize">{member.status}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-600">Joined</span>
              <span className="text-sm font-medium text-neutral-900">
                {new Date(member.joinedAt).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-600">Last Active</span>
              <span className="text-sm font-medium text-neutral-900">{member.lastActive}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
