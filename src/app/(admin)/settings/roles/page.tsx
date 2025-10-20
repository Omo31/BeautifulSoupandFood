import { adminNavItems } from "@/lib/admin-nav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const userRoles = [
  { name: "Administrator", isSuperAdmin: true },
  { name: "Content Manager", isSuperAdmin: false },
  { name: "Support Agent", isSuperAdmin: false },
];

export default function AdminRolesSettingsPage() {
  const permissions = ["View", "Create", "Edit", "Delete"];
  const modules = adminNavItems.map(item => item.label);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>Role Management</CardTitle>
                <CardDescription>Define and assign user roles and permissions.</CardDescription>
            </div>
            <Button>Add New Role</Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {userRoles.map(role => (
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
                        {permissions.map(p => <TableHead key={p} className="text-center">{p}</TableHead>)}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {modules.map(module => (
                        <TableRow key={module}>
                          <TableCell className="font-medium">{module}</TableCell>
                          {permissions.map(permission => (
                            <TableCell key={permission} className="text-center">
                              <Checkbox
                                id={`${role.name}-${module}-${permission}`}
                                disabled={role.isSuperAdmin}
                                checked={role.isSuperAdmin}
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
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
