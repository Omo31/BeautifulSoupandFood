'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow } from 'date-fns';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

// This is mock data. In a real app, you would fetch this from Firestore using onSnapshot.
const mockConversations = [
  { id: 'conv1', userName: 'Alice Johnson', lastMessage: 'Yes, that sounds perfect. Thank you!', timestamp: new Date(Date.now() - 1000 * 60 * 5), isRead: false, avatarUrl: 'https://picsum.photos/seed/alice/40/40' },
  { id: 'conv2', userName: 'Bob Williams', lastMessage: 'I would like to change my delivery address.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), isRead: true, avatarUrl: 'https://picsum.photos/seed/bob/40/40' },
  { id: 'conv3', userName: 'Charlie Brown', lastMessage: 'Can you confirm the total price?', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), isRead: false, avatarUrl: 'https://picsum.photos/seed/charlie/40/40' },
  { id: 'conv4', userName: 'Diana Prince', lastMessage: 'Great, looking forward to it.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), isRead: true, avatarUrl: 'https://picsum.photos/seed/diana/40/40' },
];

type Conversation = {
  id: string;
  userName: string;
  lastMessage: string;
  timestamp: Date;
  isRead: boolean;
  avatarUrl: string;
};

export function ConversationList() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    // In a real app, you would use onSnapshot from Firestore here.
    // For demonstration, we're using mock data with a delay.
    const timer = setTimeout(() => {
      setConversations(mockConversations);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4 p-2">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  if (conversations.length === 0) {
    return <p className="text-muted-foreground text-center py-8">No conversations yet.</p>;
  }

  return (
    <div className="space-y-1">
      {conversations.map((convo) => {
        const href = `/conversations/${convo.id}`;
        const isActive = pathname === href;
        return (
          <Link
            href={href}
            key={convo.id}
            className="block"
          >
            <div className={cn(
                'p-3 rounded-lg flex items-center gap-4 transition-colors hover:bg-muted/50',
                isActive ? "bg-muted" : (!convo.isRead ? 'bg-primary/5' : '')
            )}>
              <Avatar className="h-10 w-10">
                <AvatarImage src={convo.avatarUrl} alt={convo.userName} />
                <AvatarFallback>{convo.userName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 overflow-hidden">
                <div className="flex justify-between items-start">
                  <p className={cn('font-semibold', !convo.isRead && !isActive && 'text-primary')}>{convo.userName}</p>
                  <p className="text-xs text-muted-foreground flex-shrink-0 ml-2">
                    {formatDistanceToNow(convo.timestamp, { addSuffix: true })}
                  </p>
                </div>
                <p className={cn('text-sm text-muted-foreground truncate', !convo.isRead && !isActive && 'font-medium text-foreground')}>
                  {convo.lastMessage}
                </p>
              </div>
              {!convo.isRead && !isActive && <div className="w-2.5 h-2.5 rounded-full bg-primary self-center ml-2 flex-shrink-0"></div>}
            </div>
          </Link>
        )
      })}
    </div>
  );
}
