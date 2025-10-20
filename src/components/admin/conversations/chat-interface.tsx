'use client';

import { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

// Mock data. In a real app, this would come from Firestore.
const mockMessages: { [key: string]: Message[] } = {
  conv1: [
    { id: 'msg1', text: 'Hello, I have a question about my order.', senderId: 'user', timestamp: new Date(Date.now() - 1000 * 60 * 10) },
    { id: 'msg2', text: 'Hi there! I can help with that. What is your order number?', senderId: 'admin', timestamp: new Date(Date.now() - 1000 * 60 * 9) },
    { id: 'msg3', text: 'It is #12345.', senderId: 'user', timestamp: new Date(Date.now() - 1000 * 60 * 8) },
    { id: 'msg4', text: 'Thank you. I see your order. You requested a custom basket with extra cheese. Is that correct?', senderId: 'admin', timestamp: new Date(Date.now() - 1000 * 60 * 7) },
    { id: 'msg5', text: 'Yes, that sounds perfect. Thank you!', senderId: 'user', timestamp: new Date(Date.now() - 1000 * 60 * 5) },
  ],
  conv2: [
    { id: 'msg6', text: 'I would like to change my delivery address.', senderId: 'user', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2) },
  ],
  conv3: [],
  conv4: [],
};

type Message = {
  id: string;
  text: string;
  senderId: 'user' | 'admin';
  timestamp: Date;
};

export function ChatInterface({ conversationId }: { conversationId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    // In a real app, you would use onSnapshot from Firestore to listen for messages for the given conversationId.
    setLoading(true);
    const timer = setTimeout(() => {
      setMessages(mockMessages[conversationId] || []);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [conversationId]);
  
  useEffect(() => {
    // A small delay to allow the layout to render before scrolling
    setTimeout(scrollToBottom, 100);
  }, [messages, loading]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;

    const message: Message = {
      id: `msg${Date.now()}`,
      text: newMessage,
      senderId: 'admin', // Assuming the admin is sending the message
      timestamp: new Date(),
    };

    // In a real app, you would use addDoc to add the message to the Firestore subcollection.
    setMessages((prev) => [...prev, message]);
    setNewMessage('');
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4 pr-4">
          {loading ? (
             <div className="space-y-4">
                <div className="flex items-end gap-2">
                    <Skeleton className="w-8 h-8 rounded-full" />
                    <Skeleton className="w-2/3 h-10 rounded-lg" />
                </div>
                <div className="flex items-end gap-2 justify-end">
                    <Skeleton className="w-3/4 h-12 rounded-lg" />
                    <Skeleton className="w-8 h-8 rounded-full" />
                </div>
                 <div className="flex items-end gap-2">
                    <Skeleton className="w-8 h-8 rounded-full" />
                    <Skeleton className="w-1/2 h-8 rounded-lg" />
                </div>
             </div>
          ) : messages.length > 0 ? (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={cn('flex items-start gap-3', {
                  'justify-end': msg.senderId === 'admin',
                })}
              >
                {msg.senderId === 'user' && (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://picsum.photos/seed/user-avatar/40/40" />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    'max-w-xs lg:max-w-md rounded-lg p-3 text-sm break-words',
                    {
                      'bg-primary text-primary-foreground': msg.senderId === 'admin',
                      'bg-muted': msg.senderId === 'user',
                    }
                  )}
                >
                  {msg.text}
                </div>
                {msg.senderId === 'admin' && (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://picsum.photos/seed/admin-user/40/40" />
                    <AvatarFallback>A</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))
          ) : (
             <div className="text-center text-muted-foreground pt-16">
                 No messages in this conversation yet.
             </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      <div className="p-4 border-t bg-card">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            autoComplete="off"
            disabled={loading}
          />
          <Button type="submit" size="icon" disabled={loading || !newMessage.trim()}>
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </div>
    </div>
  );
}
