import { ConversationList } from '@/components/admin/conversations/conversation-list';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ConversationsPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Conversations</CardTitle>
                <CardDescription>View and manage customer conversations.</CardDescription>
            </CardHeader>
            <CardContent>
                <ConversationList />
            </CardContent>
        </Card>
    );
}
