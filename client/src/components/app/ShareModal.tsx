import { useState, useEffect } from 'react';
import { Share2, Copy, Check, Mail, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { toast } from 'sonner';
import { teamApi } from '@/lib/api';
import type { TeamMember } from '@/lib/api';

interface ShareModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  teamId?: string; // Optional team ID for fetching members
  projectName: string;
}

export const ShareModal = ({ open, onOpenChange, projectId, teamId, projectName }: ShareModalProps) => {
  const [permission, setPermission] = useState<'view' | 'edit'>('view');
  const [shareUrl, setShareUrl] = useState(`${window.location.origin}/projects/${projectId}`);
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState('');
  const [isInviting, setIsInviting] = useState(false);
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);
  
  // Team members state
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

  // Fetch team members if teamId is provided
  useEffect(() => {
    const fetchTeamMembers = async () => {
      if (!teamId || !open) return;
      
      try {
        const response = await teamApi.getTeamMembers(teamId);
        
        if (response.success && response.data) {
          setTeamMembers(response.data.members);
        }
      } catch (error: any) {
        console.error('Failed to fetch team members:', error);
      }
    };

    fetchTeamMembers();
  }, [teamId, open]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  const handleGenerateLink = async () => {
    setIsGeneratingLink(true);
    try {
      // Generate a shareable link with permissions
      const newShareUrl = `${window.location.origin}/projects/${projectId}?share=true&permission=${permission}`;
      setShareUrl(newShareUrl);
      await handleCopyLink(); // Auto-copy the link
      toast.success('Share link generated and copied!');
    } catch (error) {
      toast.error('Failed to generate link');
    } finally {
      setIsGeneratingLink(false);
    }
  };

  const handleInviteByEmail = async () => {
    if (!email) {
      toast.error('Please enter an email address');
      return;
    }

    if (!teamId) {
      toast.error('Team ID is required to invite members');
      return;
    }

    setIsInviting(true);
    try {
      const response = await teamApi.inviteTeamMember(teamId, {
        email,
        role: permission === 'edit' ? 'member' : 'viewer',
      });

      if (response.success) {
        toast.success(`Invitation sent to ${email}`);
        setEmail('');
        
        // Refresh team members list
        const membersResponse = await teamApi.getTeamMembers(teamId);
        if (membersResponse.success && membersResponse.data) {
          setTeamMembers(membersResponse.data.members);
        }
      } else {
        throw new Error(response.error || 'Failed to send invitation');
      }
    } catch (error: any) {
      console.error('Invite error:', error);
      toast.error(error.message || 'Failed to send invitation');
    } finally {
      setIsInviting(false);
    }
  };

  const getRoleBadgeColor = (role: TeamMember['role']) => {
    switch (role) {
      case 'owner':
        return 'bg-zinc-900 text-white';
      case 'admin':
        return 'bg-blue-100 text-blue-700';
      case 'member':
        return 'bg-emerald-100 text-emerald-700';
      case 'viewer':
        return 'bg-zinc-100 text-zinc-700';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            Share "{projectName}"
          </DialogTitle>
          <DialogDescription>
            Share this project with your team or generate a public link
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Share Link Section */}
          <div>
            <label className="text-sm font-medium text-zinc-900 mb-2 block">
              Anyone with the link can:
            </label>
            <div className="flex items-center gap-2 mb-3">
              <Select value={permission} onValueChange={(val) => setPermission(val as 'view' | 'edit')}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="view">View</SelectItem>
                  <SelectItem value="edit">Edit</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                onClick={handleGenerateLink}
                disabled={isGeneratingLink}
              >
                {isGeneratingLink ? 'Generating...' : 'Generate Link'}
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              <Input
                value={shareUrl}
                readOnly
                className="flex-1 font-mono text-sm"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopyLink}
                className="flex-shrink-0"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Invite by Email */}
          <div>
            <label className="text-sm font-medium text-zinc-900 mb-2 block">
              Or invite by email:
            </label>
            <div className="flex items-center gap-2">
              <Input
                type="email"
                placeholder="colleague@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleInviteByEmail()}
                className="flex-1"
              />
              <Button
                onClick={handleInviteByEmail}
                disabled={isInviting || !email}
                className="bg-zinc-900 hover:bg-zinc-800"
              >
                <Mail className="w-4 h-4 mr-2" />
                {isInviting ? 'Sending...' : 'Invite'}
              </Button>
            </div>
          </div>

          {/* Current Members */}
          <div>
            <label className="text-sm font-medium text-zinc-900 mb-3 block">
              Current members:
            </label>
            <div className="space-y-2">
              {teamMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-zinc-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-zinc-900 text-white flex items-center justify-center text-xs font-semibold">
                      {member.avatar ? (
                        <img src={member.avatar} alt={member.name} className="w-full h-full rounded-full" />
                      ) : (
                        member.name.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-zinc-900">{member.name}</p>
                      <p className="text-xs text-zinc-500">{member.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${getRoleBadgeColor(member.role)}`}>
                      {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                    </span>
                    {member.role !== 'owner' && (
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <X className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
