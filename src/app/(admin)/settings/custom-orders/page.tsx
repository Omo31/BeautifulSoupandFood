'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast.tsx';
import { PlusCircle, Trash2 } from 'lucide-react';

const measureSchema = z.object({
  name: z.string().min(1, 'Measure name cannot be empty.'),
});

const serviceSchema = z.object({
  id: z.string().min(1, 'Service ID cannot be empty.'),
  label: z.string().min(1, 'Service label cannot be empty.'),
});

// Mock data - in a real app, this would be fetched from Firestore settings
const initialMeasures = ['Grams', 'Kilograms', 'Pieces', 'Bunches', 'Litres'];
const initialServices = [
  { id: 'gift-wrapping', label: 'Gift Wrapping' },
  { id: 'special-packaging', label: 'Special Packaging' },
  { id: 'rush-delivery', label: 'Rush Delivery' },
];

export default function AdminCustomOrderSettingsPage() {
  const { toast } = useToast();
  const [measures, setMeasures] = useState(initialMeasures);
  const [services, setServices] = useState(initialServices);

  const measureForm = useForm<z.infer<typeof measureSchema>>({
    resolver: zodResolver(measureSchema),
    defaultValues: { name: '' },
  });

  const serviceForm = useForm<z.infer<typeof serviceSchema>>({
    resolver: zodResolver(serviceSchema),
    defaultValues: { id: '', label: '' },
  });

  const handleAddMeasure = (values: z.infer<typeof measureSchema>) => {
    if (measures.find(m => m.toLowerCase() === values.name.toLowerCase())) {
        toast({ title: "Duplicate Measure", description: "This measure already exists.", variant: "destructive" });
        return;
    }
    setMeasures([...measures, values.name]);
    measureForm.reset();
    toast({ title: 'Measure Added', description: `"${values.name}" has been added.` });
  };

  const handleRemoveMeasure = (measureToRemove: string) => {
    setMeasures(measures.filter(m => m !== measureToRemove));
    toast({ title: 'Measure Removed', description: `"${measureToRemove}" has been removed.` });
  };

  const handleAddService = (values: z.infer<typeof serviceSchema>) => {
    if (services.find(s => s.id.toLowerCase() === values.id.toLowerCase())) {
        toast({ title: "Duplicate Service ID", description: "A service with this ID already exists.", variant: "destructive" });
        return;
    }
    setServices([...services, values]);
    serviceForm.reset();
    toast({ title: 'Service Added', description: `"${values.label}" has been added.` });
  };

  const handleRemoveService = (serviceToRemove: {id: string, label: string}) => {
    setServices(services.filter(s => s.id !== serviceToRemove.id));
     toast({ title: 'Service Removed', description: `"${serviceToRemove.label}" has been removed.` });
  };

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Units of Measure</CardTitle>
          <CardDescription>
            Manage the measurement units available in the custom order form.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <form onSubmit={measureForm.handleSubmit(handleAddMeasure)} className="flex gap-2">
                <Input {...measureForm.register('name')} placeholder="e.g., Pounds" />
                <Button type="submit"><PlusCircle className="mr-2 h-4 w-4" /> Add</Button>
            </form>
            <div className="space-y-2 rounded-md border p-2">
                {measures.map(measure => (
                    <div key={measure} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50">
                        <span>{measure}</span>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleRemoveMeasure(measure)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                    </div>
                ))}
            </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Additional Services</CardTitle>
          <CardDescription>
            Manage the extra services offered for custom orders.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
           <form onSubmit={serviceForm.handleSubmit(handleAddService)} className="space-y-4 rounded-md border p-4">
              <div className="grid grid-cols-2 gap-4">
                 <Input {...serviceForm.register('label')} placeholder="Service Label (e.g., Insurance)" />
                 <Input {...serviceForm.register('id')} placeholder="Unique ID (e.g., insurance)" />
              </div>
              <Button type="submit" className="w-full"><PlusCircle className="mr-2 h-4 w-4" /> Add Service</Button>
           </form>

            <div className="space-y-2 rounded-md border p-2">
                {services.map(service => (
                    <div key={service.id} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50">
                        <div>
                            <p>{service.label}</p>
                            <p className="text-xs text-muted-foreground">ID: {service.id}</p>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleRemoveService(service)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                    </div>
                ))}
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
