
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserTable } from '@/components/users/user-table';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

const initialUsers = [
  {
    id: 'usr1',
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    role: 'Customer',
    joined: '2023-10-01',
    avatar: 'https://picsum.photos/seed/jane-doe/40/40',
    status: 'Active',
  },
  {
    id: 'usr2',
    name: 'John Smith',
    email: 'john.smith@example.com',
    role: 'Customer',
    joined: '2023-09-15',
     avatar: 'https://picsum.photos/seed/john-smith/40/40',
     status: 'Active',
  },
  {
    id: 'usr3',
    name: 'Alice Johnson',
    email: 'alice.j@gourmet.com',
    role: 'Content Manager',
    joined: '2023-08-20',
    avatar: 'https://picsum.photos/seed/alice-j/40/40',
    status: 'Disabled',
  },
    {
    id: 'usr4',
    name: 'Admin User',
    email: 'admin@gourmet.com',
    role: 'Administrator',
    joined: '2023-01-15',
    avatar: 'https://picsum.photos/seed/admin-user/40/40',
    status: 'Active',
  },
];


export default function AdminUsersPage() {
  const [users, setUsers] = useState(initialUsers);

  const toggleUserStatus = (userId: string) => {
    setUsers(users.map(user =>
      user.id === userId ? { ...user, status: user.status === 'Active' ? 'Disabled' : 'Active' } : user
    ));
  };

  return (
     <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
            <CardTitle>User Management</CardTitle>
            <CardDescription>View, edit, and manage user accounts and roles.</CardDescription>
        </div>
        <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add User
        </Button>
      </CardHeader>
      <CardContent>
        <UserTable users={users} onToggleStatus={toggleUserStatus} />
      </CardContent>
    </Card>
  );
}
