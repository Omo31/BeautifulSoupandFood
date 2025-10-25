
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { UserTable } from '@/components/users/user-table';
import { Button } from '@/components/ui/button';
import { Download, PlusCircle, SlidersHorizontal } from 'lucide-react';
import { AddUserDialog } from '@/components/users/add-user-dialog';
import { EditUserDialog } from '@/components/users/edit-user-dialog';
import type { User } from '@/components/users/user-table';
import { downloadCSV } from '@/lib/csv';
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationNext, PaginationLink } from '@/components/ui/pagination';
import { initialUsers } from '@/lib/mock-data';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';


const ITEMS_PER_PAGE = 5;

export default function AdminUsersPage() {
  const [users, setUsers] = useState(initialUsers);
  const [isAddUserOpen, setAddUserOpen] = useState(false);
  const [isEditUserOpen, setEditUserOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({ name: '', role: 'all', status: 'all' });

  const handleFilterChange = (filterName: string, value: string) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
    setCurrentPage(1);
  };

  const filteredUsers = users.filter(user => {
    const nameMatch = user.name.toLowerCase().includes(filters.name.toLowerCase()) || user.email.toLowerCase().includes(filters.name.toLowerCase());
    const roleMatch = filters.role === 'all' || user.role === filters.role;
    const statusMatch = filters.status === 'all' || user.status === filters.status;
    return nameMatch && roleMatch && statusMatch;
  });

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

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
      <Collapsible className="space-y-4">
        <div className="flex items-center justify-between">
          <CollapsibleTrigger asChild>
            <Button variant="outline">
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </CollapsibleTrigger>
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
        </div>
        <CollapsibleContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg bg-muted/50">
                <Input
                    placeholder="Filter by name or email..."
                    value={filters.name}
                    onChange={(e) => handleFilterChange('name', e.target.value)}
                />
                <Select value={filters.role} onValueChange={(value) => handleFilterChange('role', value)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Filter by role" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Roles</SelectItem>
                        <SelectItem value="Customer">Customer</SelectItem>
                        <SelectItem value="Content Manager">Content Manager</SelectItem>
                        <SelectItem value="Support Agent">Support Agent</SelectItem>
                        <SelectItem value="Administrator">Administrator</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Disabled">Disabled</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </CollapsibleContent>
      </Collapsible>

     <Card className="mt-4">
      <CardHeader>
        <div>
            <CardTitle>User Management</CardTitle>
            <CardDescription>View, edit, and manage user accounts and roles.</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <UserTable users={paginatedUsers} onToggleStatus={toggleUserStatus} onEdit={openEditDialog} />
      </CardContent>
      {totalPages > 1 && (
        <CardFooter>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); handlePageChange(Math.max(1, currentPage - 1)); }} />
              </PaginationItem>
              {[...Array(totalPages)].map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink href="#" isActive={currentPage === i + 1} onClick={(e) => { e.preventDefault(); handlePageChange(i + 1); }}>
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext href="#" onClick={(e) => { e.preventDefault(); handlePageChange(Math.min(totalPages, currentPage + 1)); }} />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </CardFooter>
      )}
    </Card>
    <AddUserDialog isOpen={isAddUserOpen} setIsOpen={setAddUserOpen} onAddUser={handleAddUser} />
    {selectedUser && <EditUserDialog isOpen={isEditUserOpen} setIsOpen={setEditUserOpen} user={selectedUser} onEditUser={handleEditUser} />}
    </>
  );
}
