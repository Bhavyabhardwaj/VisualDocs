import { useState, useEffect } from 'react';
import { PremiumLayout } from '@/components/layout/PremiumLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Crown,
  Shield,
  User,
  Clock,
  CheckCircle2,
  MoreHorizontal,
  Mail,
  Trash2,
  UserMinus,
  Settings as SettingsIcon,
  Download,
  Activity
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { teamService, type TeamMember } from '@/services/team.service';

export const PremiumTeamManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  // Load team members
  useEffect(() => {
    const loadTeamMembers = async () => {
      try {
        setLoading(true);
        // Use "default" as teamId since we don't have multi-team support yet
        const response = await teamService.getTeamMembers('default');
        if (response.data) {
          setTeamMembers(response.data.members);
        }
      } catch (error) {
        console.error('Failed to load team members:', error);
        setTeamMembers([]);
      } finally {
        setLoading(false);
      }
    };

    loadTeamMembers();
  }, []);

  const stats = {
    totalMembers: teamMembers.length,
    activeMembers: teamMembers.filter(m => new Date(m.lastActive) > new Date(Date.now() - 24 * 60 * 60 * 1000)).length,
    pendingInvites: 0,
    admins: teamMembers.filter(m => m.role.toLowerCase() === 'admin' || m.role.toLowerCase() === 'owner').length,
  };

  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'all' || member.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner':
        return <Crown className="w-4 h-4 text-yellow-600" />;
      case 'admin':
        return <Shield className="w-4 h-4 text-blue-600" />;
      default:
        return <User className="w-4 h-4 text-neutral-600" />;
    }
  };

  const getRoleBadge = (role: string) => {
    const colors = {
      owner: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      admin: 'bg-blue-50 text-blue-700 border-blue-200',
      member: 'bg-neutral-50 text-neutral-700 border-neutral-200',
    };
    return colors[role as keyof typeof colors] || colors.member;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Active</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Pending</Badge>;
      case 'suspended':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Suspended</Badge>;
      default:
        return null;
    }
  };

  const toggleMemberSelection = (memberId: string) => {
    setSelectedMembers(prev =>
      prev.includes(memberId)
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedMembers.length === filteredMembers.length) {
      setSelectedMembers([]);
    } else {
      setSelectedMembers(filteredMembers.map(m => m.id));
    }
  };

  return (
    <PremiumLayout>
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="border-b border-neutral-200 bg-white">
          <div className="mx-auto px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">Team Management</h1>
                <p className="text-neutral-600 mt-2 text-[15px]">
                  Manage your team members, roles, and permissions
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" className="h-9">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <Button className="h-9">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Invite Members
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto px-8 py-8">
          {/* Team Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
            <Card className="border-neutral-200 shadow-sm">
              <CardContent className="pt-6 pb-6 px-6">
                <div className="flex items-start justify-between mb-3">
                  <p className="text-sm font-medium text-neutral-600">Total Members</p>
                  <Users className="w-5 h-5 text-neutral-400" />
                </div>
                <p className="text-4xl font-semibold text-neutral-900">{stats.totalMembers}</p>
                <p className="text-xs text-neutral-600 mt-2">Across all roles</p>
              </CardContent>
            </Card>

            <Card className="border-neutral-200 shadow-sm">
              <CardContent className="pt-6 pb-6 px-6">
                <div className="flex items-start justify-between mb-3">
                  <p className="text-sm font-medium text-neutral-600">Active</p>
                  <CheckCircle2 className="w-5 h-5 text-neutral-400" />
                </div>
                <p className="text-4xl font-semibold text-neutral-900">{stats.activeMembers}</p>
                <p className="text-xs text-neutral-600 mt-2">Currently active</p>
              </CardContent>
            </Card>

            <Card className="border-neutral-200 shadow-sm">
              <CardContent className="pt-6 pb-6 px-6">
                <div className="flex items-start justify-between mb-3">
                  <p className="text-sm font-medium text-neutral-600">Pending Invites</p>
                  <Clock className="w-5 h-5 text-neutral-400" />
                </div>
                <p className="text-4xl font-semibold text-neutral-900">{stats.pendingInvites}</p>
                <p className="text-xs text-neutral-600 mt-2">Awaiting response</p>
              </CardContent>
            </Card>

            <Card className="border-neutral-200 shadow-sm">
              <CardContent className="pt-6 pb-6 px-6">
                <div className="flex items-start justify-between mb-3">
                  <p className="text-sm font-medium text-neutral-600">Admins</p>
                  <Shield className="w-5 h-5 text-neutral-400" />
                </div>
                <p className="text-4xl font-semibold text-neutral-900">{stats.admins}</p>
                <p className="text-xs text-neutral-600 mt-2">Admin & owner roles</p>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <Card className="border-neutral-200 shadow-sm mb-6">
            <CardContent className="pt-4 pb-4 px-6">
              <div className="flex items-center gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <Input
                    placeholder="Search members by name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 h-9 border-neutral-200"
                  />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="h-9">
                      <Filter className="w-4 h-4 mr-2" />
                      {filterRole === 'all' ? 'All Roles' : filterRole.charAt(0).toUpperCase() + filterRole.slice(1)}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setFilterRole('all')}>
                      All Roles
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterRole('owner')}>
                      <Crown className="w-4 h-4 mr-2" />
                      Owner
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterRole('admin')}>
                      <Shield className="w-4 h-4 mr-2" />
                      Admin
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterRole('member')}>
                      <User className="w-4 h-4 mr-2" />
                      Member
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>

          {/* Bulk Actions Toolbar */}
          {selectedMembers.length > 0 && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
              <p className="text-sm font-medium text-blue-900">
                {selectedMembers.length} member{selectedMembers.length > 1 ? 's' : ''} selected
              </p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-8 bg-white">
                  <Mail className="w-3.5 h-3.5 mr-2" />
                  Email
                </Button>
                <Button variant="outline" size="sm" className="h-8 bg-white">
                  <SettingsIcon className="w-3.5 h-3.5 mr-2" />
                  Change Role
                </Button>
                <Button variant="outline" size="sm" className="h-8 bg-white text-red-600 hover:bg-red-50">
                  <Trash2 className="w-3.5 h-3.5 mr-2" />
                  Remove
                </Button>
              </div>
            </div>
          )}

          {/* Members Data Table */}
          <Card className="border-neutral-200 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-neutral-200 bg-neutral-50">
                  <tr>
                    <th className="p-4 w-12">
                      <Checkbox
                        checked={selectedMembers.length === filteredMembers.length && filteredMembers.length > 0}
                        onCheckedChange={toggleSelectAll}
                      />
                    </th>
                    <th className="p-4 text-left text-sm font-semibold text-neutral-900">Member</th>
                    <th className="p-4 text-left text-sm font-semibold text-neutral-900">Role</th>
                    <th className="p-4 text-left text-sm font-semibold text-neutral-900">Status</th>
                    <th className="p-4 text-left text-sm font-semibold text-neutral-900">Projects</th>
                    <th className="p-4 text-left text-sm font-semibold text-neutral-900">Joined</th>
                    <th className="p-4 text-left text-sm font-semibold text-neutral-900">Last Active</th>
                    <th className="p-4 w-12"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMembers.map((member) => (
                    <tr
                      key={member.id}
                      className="border-b border-neutral-200 last:border-0 hover:bg-neutral-50 transition-colors"
                    >
                      <td className="p-4">
                        <Checkbox
                          checked={selectedMembers.includes(member.id)}
                          onCheckedChange={() => toggleMemberSelection(member.id)}
                        />
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8">
                            {member.avatar && <AvatarImage src={member.avatar} alt={member.name} />}
                            <AvatarFallback className="bg-blue-100 text-blue-600 text-xs font-medium">
                              {member.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="font-medium text-sm text-neutral-900">{member.name}</p>
                            <p className="text-xs text-neutral-600 truncate">{member.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant="outline" className={`${getRoleBadge(member.role.toLowerCase())} capitalize`}>
                          <span className="mr-1">{getRoleIcon(member.role.toLowerCase())}</span>
                          {member.role}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Badge variant="success" className="border-green-200 bg-green-50 text-green-700">
                          Active
                        </Badge>
                      </td>
                      <td className="p-4">
                        <span className="text-sm text-neutral-900">{member.projectCount}</span>
                      </td>
                      <td className="p-4">
                        <span className="text-sm text-neutral-600">
                          {new Date(member.joinedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="text-sm text-neutral-600">
                          {formatDistanceToNow(new Date(member.lastActive), { addSuffix: true })}
                        </span>
                      </td>
                      <td className="p-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Mail className="w-4 h-4 mr-2" />
                              Send Email
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Activity className="w-4 h-4 mr-2" />
                              View Activity
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <SettingsIcon className="w-4 h-4 mr-2" />
                              Change Role
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <UserMinus className="w-4 h-4 mr-2" />
                              Remove Member
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredMembers.length === 0 && (
              <div className="p-12 text-center">
                <Users className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                <p className="text-sm font-medium text-neutral-900 mb-1">No members found</p>
                <p className="text-sm text-neutral-600">
                  {searchQuery ? 'Try adjusting your search or filters' : 'Start by inviting team members'}
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </PremiumLayout>
  );
};
