
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserTable } from '@/components/users/user-table';
import { Button } from '@/components/ui/button';
import { Download, PlusCircle } from 'lucide-react';
import { AddUserDialog } from '@/components/users/add-user-dialog';
import { EditUserDialog } from '@/components/users/edit-user-dialog';
import type { User } from '@/components/users/user-table';
import { downloadCSV } from '@/lib/csv';


const initialUsers: User[] = [
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
  const [isAddUserOpen, setAddUserOpen] = useState(false);
  const [isEditUserOpen, setEditUserOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const toggleUserStatus = (userId: string) => {
    setUsers(users.map(user =>
      user.id === userId ? { ...user, status: user.status === 'Active' ? 'Disabled' : 'Active' } : user
    ));
  };
  
  const handleAddUser = (newUser: Omit<User, 'id' | 'joined' | 'avatar'>) => {
    const user = {
      ...newUser,
      id: `usr${users.length + 1}`,
      joined: new Date().toISOString().split('T')[0],
      avatar: `https://picsum.photos/seed/${newUser.name.split(' ').join('-')}/40/40`,
      status: 'Active'
    } as User;
    setUsers([...users, user]);
  };

  const handleEditUser = (updatedUser: User) => {
    setUsers(users.map(user => user.id === updatedUser.id ? updatedUser : user));
    setSelectedUser(null);
  };
  
  const openEditDialog = (user: User) => {
    setSelectedUser(user);
    setEditUserOpen(true);
  };

  const handleDownloadCsv = () => {
    downloadCSV('users.csv', users);
  };


  return (
    <>
     <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
            <CardTitle>User Management</CardTitle>
            <CardDescription>View, edit, and manage user accounts and roles.</CardDescription>
        </div>
        <div className="flex gap-2">
            <Button variant="outline" onClick={handleDownloadCsv}>
                <Download className="mr-2 h-4 w-4" />
                Download CSV
            </Button>
            <Button onClick={() => setAddUserOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add User
            </Button>
        </div>
      </CardHeader>
      <CardContent>
        <UserTable users={users} onToggleStatus={toggleUserStatus} onEdit={openEditDialog} />
      </CardContent>
    </Card>
    <AddUserDialog isOpen={isAddUserOpen} setIsOpen={setAddUserOpen} onAddUser={handleAddUser} />
    {selectedUser && <EditUserDialog isOpen={isEditUserOpen} setIsOpen={setEditUserOpen} user={selectedUser} onEditUser={handleEditUser} />}
    </>
  );
}
