
'use client';

import React, { useState } from 'react';
import { adminNavItems } from "@/lib/admin-nav";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlusCircle } from 'lucide-react';
import { AddRoleDialog } from '@/components/roles/add-role-dialog';
import { useToast } from '@/hooks/use-toast.tsx';

const initialUserRoles = [
  { name: "Administrator", isSuperAdmin: true, permissions: {} },
  { name: "Content Manager", isSuperAdmin: false, permissions: { 'Inventory': ['View', 'Create', 'Edit'] } },
  { name: "Support Agent", isSuperAdmin: false, permissions: { 'Conversations': ['View', 'Edit'], 'Orders': ['View'] } },
];

const allPermissions = ["View", "Create", "Edit", "Delete"];
const allModules = adminNavItems.map(item => item.label).filter(label => label !== 'Settings');

type Permissions = { [module: string]: string[] };

export default function AdminRolesSettingsPage() {
  const [roles, setRoles] = useState(initialUserRoles);
  const [isAddRoleOpen, setAddRoleOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<string | null>(null);
  const [tempPermissions, setTempPermissions] = useState<Permissions>({});
  const { toast } = useToast();

  const handlePermissionChange = (roleName: string, module: string, permission: string, checked: boolean) => {
    setTempPermissions(prev => {
      const rolePerms = prev[module] || [];
      const newPerms = checked 
        ? [...rolePerms, permission]
        : rolePerms.filter(p => p !== permission);
      
      return { ...prev, [module]: newPerms };
    });
  };

  const startEditing = (role: typeof initialUserRoles[0]) => {
    setEditingRole(role.name);
    setTempPermissions(role.permissions);
  };
  
  const cancelEditing = () => {
    setEditingRole(null);
    setTempPermissions({});
  };

  const savePermissions = (roleName: string) => {
    setRoles(roles.map(r => r.name === roleName ? { ...r, permissions: tempPermissions } : r));
    setEditingRole(null);
    setTempPermissions({});
    toast({
      title: 'Permissions Saved',
      description: `Permissions for ${roleName} have been updated.`
    });
  };
  
  const handleAddRole = (newRoleName: string) => {
    if (roles.some(r => r.name.toLowerCase() === newRoleName.toLowerCase())) {
        toast({ title: 'Error', description: 'A role with this name already exists.', variant: 'destructive'});
        return;
    }
    setRoles([...roles, { name: newRoleName, isSuperAdmin: false, permissions: {} }]);
    toast({ title: 'Role Added', description: `${newRoleName} has been created.`});
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>Role Management</CardTitle>
                <CardDescription>Define and assign user roles and permissions.</CardDescription>
            </div>
            <Button onClick={() => setAddRoleOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add New Role
            </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {roles.map(role => {
            const isEditing = editingRole === role.name;
            const permissionsToShow = isEditing ? tempPermissions : role.permissions;

            return (
              <Card key={role.name}>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    {role.name}
                    {role.isSuperAdmin && <Badge>Super Admin</Badge>}
                  </CardTitle>
                  <CardDescription>
                    {role.isSuperAdmin ? "Has all permissions by default." : `Permissions for the ${role.name} role.`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[200px]">Module</TableHead>
                          {allPermissions.map(p => <TableHead key={p} className="text-center">{p}</TableHead>)}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {allModules.map(module => (
                          <TableRow key={module}>
                            <TableCell className="font-medium">{module}</TableCell>
                            {allPermissions.map(permission => (
                              <TableCell key={permission} className="text-center">
                                <Checkbox
                                  id={`${role.name}-${module}-${permission}`}
                                  disabled={role.isSuperAdmin || !isEditing}
                                  checked={role.isSuperAdmin || (permissionsToShow[module] || []).includes(permission)}
                                  onCheckedChange={(checked) => handlePermissionChange(role.name, module, permission, !!checked)}
                                  aria-label={`${permission} permission for ${module}`}
                                />
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
                {!role.isSuperAdmin && (
                    <CardFooter className="justify-end gap-2">
                        {isEditing ? (
                            <>
                                <Button variant="ghost" onClick={cancelEditing}>Cancel</Button>
                                <Button onClick={() => savePermissions(role.name)}>Save Permissions</Button>
                            </>
                        ) : (
                             <Button variant="outline" onClick={() => startEditing(role)}>Edit Permissions</Button>
                        )}
                    </CardFooter>
                )}
              </Card>
            )
          })}
        </CardContent>
      </Card>
      <AddRoleDialog isOpen={isAddRoleOpen} setIsOpen={setAddRoleOpen} onAddRole={handleAddRole} />
    </>
  );
}
