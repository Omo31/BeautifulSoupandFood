'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { MessageSquare, Send, X } from 'lucide-react';
import { Input } from '../ui/input';
import { Separator } from '../ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { ScrollArea } from '../ui/scroll-area';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

type Message = {
  id: number;
  text: string;
  sender: 'user' | 'agent';
};

export function FloatingChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Hi! How can we help you today? Feel free to ask any questions about our products or your orders.", sender: 'agent' },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text: newMessage,
      sender: 'user',
    };

    // In a real app, you'd send this message to a backend service.
    // For now, we'll just simulate a response.
    setMessages((prev) => [...prev, userMessage]);
    setNewMessage('');

    setTimeout(() => {
        const agentResponse: Message = {
            id: Date.now() + 1,
            text: "Thanks for your message! A customer agent will get back to you shortly.",
            sender: 'agent',
        };
        setMessages((prev) => [...prev, agentResponse]);
    }, 1000);
    
    toast({
        title: "Message Sent!",
        description: "We've received your message and will get back to you soon."
    })
  };
  
  useEffect(() => {
    if (scrollAreaRef.current) {
        // A slight delay is needed to ensure the DOM is updated before scrolling
        setTimeout(() => {
             const viewport = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]');
             if(viewport) {
                viewport.scrollTop = viewport.scrollHeight;
             }
        }, 100);
    }
  }, [messages, isOpen]);


  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          size="icon"
          className="fixed bottom-24 right-6 h-14 w-14 rounded-full shadow-lg z-50"
        >
          <MessageSquare className="h-7 w-7" />
          <span className="sr-only">Open Chat</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent side="top" align="end" className="w-80 md:w-96 rounded-xl p-0 overflow-hidden">
        <div className="flex flex-col h-[60vh] max-h-[450px]">
          <header className="p-4 bg-primary text-primary-foreground">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Avatar>
                        <AvatarImage src="https://picsum.photos/seed/support-agent/40/40" />
                        <AvatarFallback>CS</AvatarFallback>
                    </Avatar>
                    <div>
                        <h3 className="font-semibold">Customer Support</h3>
                        <p className="text-xs text-primary-foreground/80">We're here to help!</p>
                    </div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-primary-foreground hover:bg-primary/80 hover:text-primary-foreground" onClick={() => setIsOpen(false)}>
                    <X className="h-5 w-5" />
                </Button>
            </div>
          </header>
          
          <ScrollArea className="flex-1" ref={scrollAreaRef}>
             <div className="p-4 space-y-4">
                 {messages.map((msg) => (
                    <div key={msg.id} className={cn("flex items-end gap-2", msg.sender === 'user' ? 'justify-end' : '')}>
                        {msg.sender === 'agent' && <Avatar className="h-6 w-6"><AvatarFallback>A</AvatarFallback></Avatar>}
                        <div className={cn("max-w-[80%] rounded-lg px-3 py-2 text-sm break-words", msg.sender === 'user' ? 'bg-secondary text-secondary-foreground rounded-br-none' : 'bg-muted rounded-bl-none')}>
                            {msg.text}
                        </div>
                    </div>
                ))}
             </div>
          </ScrollArea>

          <Separator />
          <div className="p-4 bg-background">
            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                autoComplete="off"
              />
              <Button type="submit" size="icon" disabled={!newMessage.trim()}>
                <Send className="h-4 w-4" />
                <span className="sr-only">Send</span>
              </Button>
            </form>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
