import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface User {
  id: string;
  name: string;
  avatar: string;
  color: string;
  cursor?: { x: number; y: number };
}

interface Comment {
  id: string;
  userId: string;
  userName: string;
  content: string;
  x: number;
  y: number;
  createdAt: string;
  resolved: boolean;
}

interface CollaborationContextType {
  users: User[];
  comments: Comment[];
  socket: Socket | null;
  addComment: (comment: Omit<Comment, 'id' | 'createdAt'>) => void;
  resolveComment: (commentId: string) => void;
  updateCursor: (x: number, y: number) => void;
}

const CollaborationContext = createContext<CollaborationContextType | undefined>(undefined);

interface CollaborationProviderProps {
  children: React.ReactNode;
  projectId: string;
}

export const CollaborationProvider: React.FC<CollaborationProviderProps> = ({ 
  children, 
  projectId 
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io('/collaboration', {
      query: { projectId }
    });

    newSocket.on('user-joined', (user: User) => {
      setUsers(prev => [...prev.filter(u => u.id !== user.id), user]);
    });

    newSocket.on('user-left', (userId: string) => {
      setUsers(prev => prev.filter(u => u.id !== userId));
    });

    newSocket.on('cursor-moved', ({ userId, x, y }: { userId: string; x: number; y: number }) => {
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, cursor: { x, y } } : user
      ));
    });

    newSocket.on('comment-added', (comment: Comment) => {
      setComments(prev => [...prev, comment]);
    });

    newSocket.on('comment-resolved', (commentId: string) => {
      setComments(prev => prev.map(comment => 
        comment.id === commentId ? { ...comment, resolved: true } : comment
      ));
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [projectId]);

  const addComment = (comment: Omit<Comment, 'id' | 'createdAt'>) => {
    if (socket) {
      socket.emit('add-comment', {
        ...comment,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      });
    }
  };

  const resolveComment = (commentId: string) => {
    if (socket) {
      socket.emit('resolve-comment', commentId);
    }
  };

  const updateCursor = (x: number, y: number) => {
    if (socket) {
      socket.emit('cursor-move', { x, y });
    }
  };

  return (
    <CollaborationContext.Provider value={{
      users,
      comments,
      socket,
      addComment,
      resolveComment,
      updateCursor
    }}>
      {children}
    </CollaborationContext.Provider>
  );
};

export const useCollaboration = () => {
  const context = useContext(CollaborationContext);
  if (!context) {
    throw new Error('useCollaboration must be used within CollaborationProvider');
  }
  return context;
};
