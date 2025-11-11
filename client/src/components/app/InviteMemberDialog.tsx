import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Mail, UserPlus, Loader2, Shield, User, Eye, Info } from 'lucide-react';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';

interface InviteMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMemberInvited?: () => void;
}

export function InviteMemberDialog({
  open,
  onOpenChange,
  onMemberInvited,
}: InviteMemberDialogProps) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'MEMBER' | 'ADMIN' | 'VIEWER'>('MEMBER');
  const [isInviting, setIsInviting] = useState(false);

  const handleInvite = async () => {
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    try {
      setIsInviting(true);

      const response = await apiClient.post(`/api/teams/invite`, {
        email,
        role
      }) as any;

      if (response?.success) {
        const message = response?.data?.message || `Invitation sent to ${email}`;
        const isAutoAdded = response?.data?.autoAdded;
        
        toast.success(message, {
          description: isAutoAdded 
            ? `${email} has been added to your team immediately.`
            : `${email} will receive an email with instructions to join your team.`,
        });
        
        setEmail('');
        setRole('MEMBER');
        onOpenChange(false);
        onMemberInvited?.();
      } else {
        throw new Error(response?.error || 'Failed to send invitation');
      }
    } catch (error: any) {
      console.error('Invite error:', error);
      const errorMessage = error?.response?.data?.error || error?.message || 'Failed to send invitation';
      toast.error(errorMessage);
    } finally {
      setIsInviting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px] p-0 gap-0 overflow-hidden bg-white border border-neutral-200 shadow-xl">
        {/* Header Section - Clean white with subtle shadow */}
        <div className="relative px-6 pt-6 pb-5 bg-white border-b border-neutral-100">
          <div className="flex items-start gap-4">
            {/* Icon with subtle gradient */}
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neutral-50 to-neutral-100 flex items-center justify-center ring-1 ring-neutral-200/50">
                <UserPlus className="w-5 h-5 text-neutral-700" strokeWidth={2.5} />
              </div>
            </div>
            
            {/* Text Content */}
            <div className="flex-1 pt-0.5">
              <DialogTitle className="text-xl font-semibold text-neutral-900 leading-tight mb-1.5">
                Invite Team Member
              </DialogTitle>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Add a new member to your team by entering their email address and selecting their role
              </p>
            </div>
          </div>
        </div>

        {/* Form Content - ALL WHITE */}
        <div className="px-6 py-6 space-y-5 bg-white">
          {/* Email Input Section */}
          <div className="space-y-2.5">
            <Label 
              htmlFor="email" 
              className="text-sm font-semibold text-neutral-900 flex items-center gap-2"
            >
              Email Address
              <span className="text-red-500 text-xs">*</span>
            </Label>
            <div className="relative group">
              <Input
                id="email"
                type="email"
                placeholder="colleague@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !isInviting && handleInvite()}
                className="h-12 pl-11 pr-4 text-sm bg-white border-2 border-neutral-200 rounded-xl 
                         focus:border-neutral-900 focus:ring-4 focus:ring-neutral-100 
                         transition-all duration-200 group-hover:border-neutral-300
                         disabled:bg-neutral-50 disabled:cursor-not-allowed"
                disabled={isInviting}
                autoFocus
              />
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 
                            group-hover:text-neutral-600 transition-colors pointer-events-none" />
            </div>
          </div>

          {/* Role Selection */}
          <div className="space-y-2.5">
            <Label 
              htmlFor="role" 
              className="text-sm font-semibold text-neutral-900 flex items-center gap-2"
            >
              Role & Permissions
              <span className="text-red-500 text-xs">*</span>
            </Label>
            <Select
              value={role}
              onValueChange={(value) => setRole(value as typeof role)}
              disabled={isInviting}
            >
              <SelectTrigger className="h-12 text-sm bg-white border-2 border-neutral-200 rounded-xl 
                                      hover:border-neutral-300 focus:border-neutral-900 focus:ring-4 focus:ring-neutral-100
                                      transition-all duration-200 disabled:bg-neutral-50 disabled:cursor-not-allowed">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white border-2 border-neutral-200 rounded-xl shadow-xl">
                {/* Viewer Role */}
                <SelectItem 
                  value="VIEWER" 
                  className="cursor-pointer py-3 px-3 focus:bg-neutral-50 rounded-lg mx-1 my-0.5"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center flex-shrink-0 
                                  ring-1 ring-neutral-200/50 transition-transform hover:scale-105">
                      <Eye className="w-4 h-4 text-neutral-700" strokeWidth={2.5} />
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="font-semibold text-neutral-900 text-sm">Viewer</span>
                      <span className="text-xs text-neutral-500 leading-tight">Read-only access to view projects</span>
                    </div>
                  </div>
                </SelectItem>

                {/* Member Role */}
                <SelectItem 
                  value="MEMBER" 
                  className="cursor-pointer py-3 px-3 focus:bg-blue-50 rounded-lg mx-1 my-0.5"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 
                                  ring-1 ring-blue-100 transition-transform hover:scale-105">
                      <User className="w-4 h-4 text-blue-600" strokeWidth={2.5} />
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="font-semibold text-neutral-900 text-sm">Member</span>
                      <span className="text-xs text-neutral-500 leading-tight">Can create and edit projects</span>
                    </div>
                  </div>
                </SelectItem>

                {/* Admin Role */}
                <SelectItem 
                  value="ADMIN" 
                  className="cursor-pointer py-3 px-3 focus:bg-purple-50 rounded-lg mx-1 my-0.5"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0 
                                  ring-1 ring-purple-100 transition-transform hover:scale-105">
                      <Shield className="w-4 h-4 text-purple-600" strokeWidth={2.5} />
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="font-semibold text-neutral-900 text-sm">Admin</span>
                      <span className="text-xs text-neutral-500 leading-tight">Full access to manage team & projects</span>
                    </div>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Info Banner - Clean light theme with subtle styling */}
          <div className="rounded-xl bg-gradient-to-br from-neutral-50 to-white border border-neutral-200 p-4">
            <div className="flex gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <div className="w-5 h-5 rounded-full bg-neutral-900 flex items-center justify-center">
                  <Info className="w-3 h-3 text-white" strokeWidth={3} />
                </div>
              </div>
              <div className="flex-1">
                <p className="text-xs text-neutral-600 leading-relaxed">
                  <span className="font-semibold text-neutral-900">Quick Add: </span>
                  If the email is already registered, they'll be added instantly. 
                  Otherwise, we'll send an invitation link via email.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions - White with better button styling */}
        <div className="px-6 py-4 bg-white border-t border-neutral-100">
          <div className="flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isInviting}
              className="h-11 px-5 border-2 border-neutral-200 hover:bg-neutral-50 hover:border-neutral-300 
                       text-neutral-700 font-semibold rounded-xl transition-all duration-200
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleInvite}
              disabled={isInviting || !email.trim()}
              className="h-11 px-6 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold rounded-xl
                       disabled:bg-neutral-300 disabled:cursor-not-allowed
                       transition-all duration-200 shadow-sm hover:shadow-lg hover:scale-[1.02]
                       active:scale-[0.98]"
            >
              {isInviting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Sending...
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Send Invitation
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
