import { useState, useEffect } from 'react';
import { Users, MessageSquare, Phone } from 'lucide-react';
import { Button } from '../ui/button';
import { toast } from 'sonner';

interface CollaboratorPresence {
  id: string;
  name: string;
  avatar?: string;
  status: 'viewing' | 'editing';
  cursor?: { x: number; y: number };
}

interface CollaborationBarProps {
  projectId: string;
  projectName: string;
}

export const CollaborationBar = ({ projectId, projectName }: CollaborationBarProps) => {
  const [collaborators, setCollaborators] = useState<CollaboratorPresence[]>([
    {
      id: '1',
      name: 'You',
      status: 'editing',
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      status: 'viewing',
    },
    {
      id: '3',
      name: 'Mike Chen',
      status: 'editing',
    },
  ]);

  const [unreadComments, setUnreadComments] = useState(5);

  useEffect(() => {
    // TODO: Connect to WebSocket for real-time collaboration
    // const ws = new WebSocket(`ws://localhost:3000/collaboration/${projectId}`);
    
    // ws.onmessage = (event) => {
    //   const data = JSON.parse(event.data);
    //   if (data.type === 'user_joined') {
    //     setCollaborators(prev => [...prev, data.user]);
    //   }
    // };

    // return () => ws.close();
  }, [projectId]);

  const handleStartCall = () => {
    toast.info('Video call feature coming soon!', {
      description: 'Connect with your team in real-time',
    });
  };

  return (
    <div className="bg-white border-b border-zinc-200 px-6 py-3">
      <div className="flex items-center justify-between">
        {/* Left: Active Collaborators */}
        <div className="flex items-center gap-4">
          {/* Avatars */}
          <div className="flex -space-x-2">
            {collaborators.map((collaborator) => (
              <div
                key={collaborator.id}
                className="relative"
                title={`${collaborator.name} (${collaborator.status})`}
              >
                {collaborator.avatar ? (
                  <img
                    src={collaborator.avatar}
                    alt={collaborator.name}
                    className="w-8 h-8 rounded-full border-2 border-white"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-zinc-900 text-white border-2 border-white flex items-center justify-center text-xs font-semibold">
                    {collaborator.name.charAt(0).toUpperCase()}
                  </div>
                )}
                {/* Status indicator */}
                {collaborator.status === 'editing' && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                )}
              </div>
            ))}
          </div>

          {/* Count */}
          <div className="text-sm text-zinc-600">
            <span className="font-medium text-zinc-900">{collaborators.length}</span>
            {' '}
            {collaborators.length === 1 ? 'person' : 'people'} viewing this project
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Comments */}
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            <span className="hidden sm:inline">Comments</span>
            {unreadComments > 0 && (
              <span className="ml-1 px-1.5 py-0.5 bg-red-500 text-white text-xs font-semibold rounded-full">
                {unreadComments}
              </span>
            )}
          </Button>

          {/* Video Call */}
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={handleStartCall}
          >
            <Phone className="w-4 h-4" />
            <span className="hidden sm:inline">Call</span>
          </Button>
        </div>
      </div>

      {/* Active Editors Indicator */}
      {collaborators.filter(c => c.status === 'editing' && c.id !== '1').length > 0 && (
        <div className="mt-2 flex items-center gap-2 text-xs text-zinc-600">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span>
            {collaborators
              .filter(c => c.status === 'editing' && c.id !== '1')
              .map(c => c.name)
              .join(', ')}{' '}
            {collaborators.filter(c => c.status === 'editing' && c.id !== '1').length === 1 ? 'is' : 'are'}{' '}
            editing
          </span>
        </div>
      )}
    </div>
  );
};

// Live cursor component (optional - can be added to pages)
export const LiveCursor = ({ collaborator }: { collaborator: CollaboratorPresence }) => {
  if (!collaborator.cursor) return null;

  return (
    <div
      className="fixed pointer-events-none z-50 transition-all duration-100"
      style={{
        left: collaborator.cursor.x,
        top: collaborator.cursor.y,
      }}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M5 3L19 12L12 13L9 20L5 3Z"
          fill="currentColor"
          className="text-emerald-500"
        />
      </svg>
      <div className="ml-6 -mt-4 px-2 py-1 bg-emerald-500 text-white text-xs font-medium rounded whitespace-nowrap">
        {collaborator.name}
      </div>
    </div>
  );
};
