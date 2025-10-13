import { useState } from 'react';
import {
  Users, Mail, MoreHorizontal, UserPlus, Search, Filter, Crown,
  Shield, User, Calendar, Clock, CheckCircle2, XCircle, Settings,
  Download, Upload, Activity, AlertCircle, ChevronDown, Copy, Trash2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { formatDistanceToNow } from 'date-fns';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  status: 'active' | 'pending' | 'suspended';
  joinedAt: Date;
  lastActive: Date;
  projectsCount: number;
}

interface Invitation {
  id: string;
  email: string;
  role: 'admin' | 'member' | 'viewer';
  sentAt: Date;
  sentBy: string;
  status: 'pending' | 'accepted' | 'expired';
}

export const TeamManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [showInviteDialog, setShowInviteDialog] = useState(false);

  const members: TeamMember[] = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      avatar: 'JD',
      role: 'owner',
      status: 'active',
      joinedAt: new Date('2024-01-15'),
      lastActive: new Date(),
      projectsCount: 15,
    },
    {
      id: '2',
      name: 'Sarah Wilson',
      email: 'sarah@example.com',
      avatar: 'SW',
      role: 'admin',
      status: 'active',
      joinedAt: new Date('2024-02-20'),
      lastActive: new Date(Date.now() - 1000 * 60 * 15),
      projectsCount: 12,
    },
    {
      id: '3',
      name: 'Mike Chen',
      email: 'mike@example.com',
      avatar: 'MC',
      role: 'member',
      status: 'active',
      joinedAt: new Date('2024-03-10'),
      lastActive: new Date(Date.now() - 1000 * 60 * 60 * 2),
      projectsCount: 8,
    },
    {
      id: '4',
      name: 'Emma Davis',
      email: 'emma@example.com',
      avatar: 'ED',
      role: 'member',
      status: 'active',
      joinedAt: new Date('2024-04-05'),
      lastActive: new Date(Date.now() - 1000 * 60 * 60 * 24),
      projectsCount: 5,
    },
    {
      id: '5',
      name: 'Alex Johnson',
      email: 'alex@example.com',
      avatar: 'AJ',
      role: 'viewer',
      status: 'pending',
      joinedAt: new Date('2024-05-01'),
      lastActive: new Date(Date.now() - 1000 * 60 * 60 * 48),
      projectsCount: 0,
    },
  ];

  const invitations: Invitation[] = [
    {
      id: '1',
      email: 'newuser@example.com',
      role: 'member',
      sentAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
      sentBy: 'John Doe',
      status: 'pending',
    },
    {
      id: '2',
      email: 'designer@example.com',
      role: 'viewer',
      sentAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
      sentBy: 'Sarah Wilson',
      status: 'expired',
    },
  ];

  const getRoleConfig = (role: string) => {
    const configs = {
      owner: { label: 'Owner', icon: Crown, className: 'bg-purple-50 text-purple-700 border-purple-200' },
      admin: { label: 'Admin', icon: Shield, className: 'bg-blue-50 text-blue-700 border-blue-200' },
      member: { label: 'Member', icon: User, className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
      viewer: { label: 'Viewer', icon: User, className: 'bg-gray-50 text-gray-700 border-gray-200' },
    };
    return configs[role as keyof typeof configs] || configs.viewer;
  };

  const getStatusConfig = (status: string) => {
    const configs = {
      active: { label: 'Active', className: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle2 },
      pending: { label: 'Pending', className: 'bg-amber-50 text-amber-700 border-amber-200', icon: Clock },
      suspended: { label: 'Suspended', className: 'bg-red-50 text-red-700 border-red-200', icon: XCircle },
    };
    return configs[status as keyof typeof configs] || configs.active;
  };

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'all' || member.role === filterRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-[1400px] px-6 py-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 p-2.5 shadow-sm">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-semibold tracking-tight text-gray-900">Team Management</h1>
                  <p className="text-sm text-gray-600 mt-1">Manage your team members and permissions</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="gap-2 hover:bg-gray-50">
                <Download className="h-4 w-4" />
                Export
              </Button>
              <Button size="sm" className="gap-2 bg-gray-900 hover:bg-gray-800" onClick={() => setShowInviteDialog(true)}>
                <UserPlus className="h-4 w-4" />
                Invite Member
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{members.length}</div>
                    <div className="text-xs text-gray-600 mt-1">Total Members</div>
                  </div>
                  <Users className="h-8 w-8 text-gray-400" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {members.filter(m => m.status === 'active').length}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">Active Members</div>
                  </div>
                  <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {invitations.filter(i => i.status === 'pending').length}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">Pending Invites</div>
                  </div>
                  <Mail className="h-8 w-8 text-amber-500" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {members.filter(m => m.role === 'admin' || m.role === 'owner').length}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">Admins</div>
                  </div>
                  <Shield className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="mx-auto max-w-[1400px] px-6 py-8">
        <Tabs defaultValue="members" className="space-y-6">
          <TabsList>
            <TabsTrigger value="members" className="gap-2">
              <Users className="h-4 w-4" />
              Members
            </TabsTrigger>
            <TabsTrigger value="invitations" className="gap-2">
              <Mail className="h-4 w-4" />
              Invitations
            </TabsTrigger>
            <TabsTrigger value="activity" className="gap-2">
              <Activity className="h-4 w-4" />
              Activity Log
            </TabsTrigger>
          </TabsList>

          {/* Members Tab */}
          <TabsContent value="members" className="space-y-6">
            {/* Filters */}
            <div className="flex items-center gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search members..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-9 bg-gray-50 border-gray-200"
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2 hover:bg-gray-50">
                    <Filter className="h-4 w-4" />
                    Role: {filterRole === 'all' ? 'All' : filterRole}
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setFilterRole('all')}>All Roles</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterRole('owner')}>Owner</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterRole('admin')}>Admin</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterRole('member')}>Member</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterRole('viewer')}>Viewer</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Members List */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredMembers.map((member) => {
                const roleConfig = getRoleConfig(member.role);
                const statusConfig = getStatusConfig(member.status);
                const RoleIcon = roleConfig.icon;
                const StatusIcon = statusConfig.icon;

                return (
                  <Card key={member.id} className="border-gray-200 hover:shadow-lg transition-shadow">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-12 w-12 ring-2 ring-gray-100">
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-semibold">
                              {member.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold text-gray-900">{member.name}</h3>
                            <p className="text-xs text-gray-600">{member.email}</p>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-gray-100">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Mail className="h-4 w-4 mr-2" />
                              Send Message
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Settings className="h-4 w-4 mr-2" />
                              Change Role
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Remove Member
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div className="flex items-center gap-2 mb-4">
                        <Badge className={`${roleConfig.className} gap-1 text-xs`}>
                          <RoleIcon className="h-3 w-3" />
                          {roleConfig.label}
                        </Badge>
                        <Badge className={`${statusConfig.className} gap-1 text-xs`}>
                          <StatusIcon className="h-3 w-3" />
                          {statusConfig.label}
                        </Badge>
                      </div>

                      <div className="space-y-2 text-xs text-gray-600">
                        <div className="flex items-center justify-between">
                          <span>Projects</span>
                          <span className="font-medium text-gray-900">{member.projectsCount}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Joined</span>
                          <span className="font-medium text-gray-900">
                            {formatDistanceToNow(member.joinedAt, { addSuffix: true })}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Last active</span>
                          <span className="font-medium text-gray-900">
                            {formatDistanceToNow(member.lastActive, { addSuffix: true })}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Invitations Tab */}
          <TabsContent value="invitations" className="space-y-6">
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle>Pending Invitations</CardTitle>
                <CardDescription>Manage sent invitations to join your team</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {invitations.map((invitation) => (
                    <div
                      key={invitation.id}
                      className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="rounded-full bg-gray-100 p-3">
                          <Mail className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{invitation.email}</div>
                          <div className="text-xs text-gray-600 mt-1">
                            Invited by {invitation.sentBy} • {formatDistanceToNow(invitation.sentAt, { addSuffix: true })}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={getRoleConfig(invitation.role).className}>
                          {getRoleConfig(invitation.role).label}
                        </Badge>
                        <Badge
                          className={
                            invitation.status === 'pending'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : invitation.status === 'expired'
                              ? 'bg-red-50 text-red-700 border-red-200'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          }
                        >
                          {invitation.status}
                        </Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Copy className="h-4 w-4 mr-2" />
                              Copy Link
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Mail className="h-4 w-4 mr-2" />
                              Resend
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <XCircle className="h-4 w-4 mr-2" />
                              Cancel
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activity Log Tab */}
          <TabsContent value="activity" className="space-y-6">
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Track team member actions and changes</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px] pr-4">
                  <div className="space-y-4">
                    {[
                      { user: 'John Doe', action: 'invited', target: 'newuser@example.com', time: new Date(Date.now() - 1000 * 60 * 30) },
                      { user: 'Sarah Wilson', action: 'changed role of', target: 'Mike Chen to Admin', time: new Date(Date.now() - 1000 * 60 * 120) },
                      { user: 'Emma Davis', action: 'joined the team', target: '', time: new Date(Date.now() - 1000 * 60 * 60 * 24) },
                      { user: 'John Doe', action: 'removed', target: 'old@example.com', time: new Date(Date.now() - 1000 * 60 * 60 * 48) },
                    ].map((activity, i) => (
                      <div key={i} className="flex items-start gap-4 p-4 rounded-lg border border-gray-200">
                        <Avatar className="h-10 w-10 flex-shrink-0">
                          <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-400 text-white text-xs">
                            {activity.user.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">
                            <span className="font-semibold">{activity.user}</span>{' '}
                            <span className="text-gray-600">{activity.action}</span>{' '}
                            {activity.target && <span className="font-medium">{activity.target}</span>}
                          </p>
                          <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDistanceToNow(activity.time, { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Invite Dialog (Simple Overlay) */}
      {showInviteDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md border-gray-200">
            <CardHeader>
              <CardTitle>Invite Team Member</CardTitle>
              <CardDescription>Send an invitation to join your team</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" placeholder="colleague@example.com" className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <select id="role" className="w-full mt-1.5 h-9 rounded-md border border-gray-200 px-3 text-sm">
                  <option value="viewer">Viewer</option>
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <Button variant="outline" className="flex-1" onClick={() => setShowInviteDialog(false)}>
                  Cancel
                </Button>
                <Button className="flex-1 bg-gray-900 hover:bg-gray-800">
                  Send Invitation
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
