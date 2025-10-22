
'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

type AddRoleDialogProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onAddRole: (roleName: string) => void;
};

export function AddRoleDialog({ isOpen, setIsOpen, onAddRole }: AddRoleDialogProps) {
    const [roleName, setRoleName] = useState('');

    const handleSubmit = () => {
        if (roleName.trim()) {
            onAddRole(roleName.trim());
            setRoleName('');
            setIsOpen(false);
        }
    };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Role</DialogTitle>
          <DialogDescription>
            Enter a name for the new role. You can set permissions after creating it.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role-name" className="text-right">
                    Role Name
                </Label>
                <Input 
                    id="role-name"
                    value={roleName}
                    onChange={(e) => setRoleName(e.target.value)}
                    className="col-span-3"
                    placeholder="e.g., Marketing Manager"
                />
            </div>
        </div>
        <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
            </Button>
            <Button type="button" onClick={handleSubmit}>Add Role</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
