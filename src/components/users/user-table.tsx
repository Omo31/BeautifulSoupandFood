
'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast.tsx";

export type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  joined: string;
  avatar?: string;
  status: 'Active' | 'Disabled';
};

type UserTableProps = {
  users: User[];
  onToggleStatus: (userId: string) => void;
  onEdit: (user: User) => void;
  availableRoles: string[];
};


export function UserTable({ users, onToggleStatus, onEdit, availableRoles }: UserTableProps) {
  const { toast } = useToast();

  const getRoleBadge = (role: User['role']) => {
    switch (role) {
      case 'Administrator':
        return <Badge>{role}</Badge>;
      case 'Content Manager':
        return <Badge variant="secondary">{role}</Badge>;
      case 'Support Agent':
          return <Badge className="bg-blue-100 text-blue-800">{role}</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  const getStatusBadge = (status: User['status']) => {
    switch (status) {
        case 'Active':
            return <Badge className="bg-green-100 text-green-800 hover:bg-green-100/80">Active</Badge>;
        case 'Disabled':
            return <Badge variant="destructive">Disabled</Badge>;
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>User</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Role</TableHead>
          <TableHead className="hidden md:table-cell">Date Joined</TableHead>
          <TableHead>
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id} className={cn(user.status === 'Disabled' && 'bg-muted/50 text-muted-foreground')}>
            <TableCell>
                <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="font-medium">
                        <div>{user.name}</div>
                        <div className={cn("text-sm", user.status === 'Active' ? 'text-muted-foreground' : '')}>{user.email}</div>
                    </div>
                </div>
            </TableCell>
            <TableCell>{getStatusBadge(user.status)}</TableCell>
            <TableCell>{getRoleBadge(user.role)}</TableCell>
            <TableCell className="hidden md:table-cell">{new Date(user.joined).toLocaleDateString()}</TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button aria-haspopup="true" size="icon" variant="ghost">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => onEdit(user)}>Edit</DropdownMenuItem>
                   <DropdownMenuItem onClick={() => onToggleStatus(user.id)}>
                    {user.status === 'Active' ? 'Disable' : 'Enable'}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="text-destructive"
                    onClick={() => toast({ title: 'Simulated Action', description: `Deleting user: ${user.name}`})}
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
