import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { ChatInterface } from '@/components/admin/conversations/chat-interface';
import { Button } from '@/components/ui/button';
import { Card, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Mock function to get conversation details. In a real app, this would be fetched from a database.
async function getConversationDetails(id: string) {
    const mockConversations = [
        { id: 'conv1', userName: 'Alice Johnson', avatarUrl: 'https://picsum.photos/seed/alice/40/40' },
        { id: 'conv2', userName: 'Bob Williams', avatarUrl: 'https://picsum.photos/seed/bob/40/40' },
        { id: 'conv3', userName: 'Charlie Brown', avatarUrl: 'https://picsum.photos/seed/charlie/40/40' },
        { id: 'conv4', userName: 'Diana Prince', avatarUrl: 'https://picsum.photos/seed/diana/40/40' },
    ];
    return mockConversations.find(c => c.id === id) || { userName: 'Unknown User', avatarUrl: '' };
}

export default async function ConversationPage({ params }: { params: { id: string } }) {
  const conversation = await getConversationDetails(params.id);

  return (
    <Card className="h-[calc(100vh-8.5rem)] flex flex-col">
       <CardHeader className="flex flex-row items-center gap-4 border-b">
         <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
          <Link href="/admin/conversations">
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back to conversations</span>
          </Link>
         </Button>
         <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={conversation.avatarUrl} alt={conversation.userName} />
              <AvatarFallback>{conversation.userName.charAt(0)}</AvatarFallback>
            </Avatar>
            <h2 className="text-lg font-semibold">{conversation.userName}</h2>
         </div>
      </CardHeader>
      <ChatInterface conversationId={params.id} />
    </Card>
  );
}
