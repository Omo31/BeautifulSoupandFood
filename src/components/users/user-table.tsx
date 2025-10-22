
'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

type User = {
  id: string;
  name: string;
  email: string;
  role: 'Customer' | 'Administrator' | 'Content Manager' | 'Support Agent';
  joined: string;
  avatar?: string;
};

export function UserTable({ users }: { users: User[] }) {

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

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>User</TableHead>
          <TableHead>Role</TableHead>
          <TableHead className="hidden md:table-cell">Date Joined</TableHead>
          <TableHead>
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>
                <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="font-medium">
                        <div>{user.name}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                    </div>
                </div>
            </TableCell>
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
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                  <DropdownMenuItem>Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
