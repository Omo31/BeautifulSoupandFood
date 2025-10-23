
'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import type { DateRange } from 'react-day-picker';

const ALL_STATUSES = ['Delivered', 'Pending', 'Awaiting Confirmation', 'Rejected'];

export type OrderFilters = {
  statuses: string[];
  dateRange: DateRange | undefined;
};

type OrderFilterDialogProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onApplyFilters: (filters: OrderFilters) => void;
  currentFilters: OrderFilters;
};

export function OrderFilterDialog({
  isOpen,
  setIsOpen,
  onApplyFilters,
  currentFilters,
}: OrderFilterDialogProps) {
  const [selectedStatuses, setSelectedStatuses] = useState(currentFilters.statuses);
  const [date, setDate] = useState<DateRange | undefined>(currentFilters.dateRange);

  useEffect(() => {
    setSelectedStatuses(currentFilters.statuses);
    setDate(currentFilters.dateRange);
  }, [currentFilters, isOpen]);
  
  const handleStatusChange = (status: string, checked: boolean | 'indeterminate') => {
    setSelectedStatuses(prev => 
      checked ? [...prev, status] : prev.filter(s => s !== status)
    );
  };

  const handleApply = () => {
    onApplyFilters({
      statuses: selectedStatuses,
      dateRange: date,
    });
    setIsOpen(false);
  };

  const handleClear = () => {
    setSelectedStatuses([]);
    setDate(undefined);
    onApplyFilters({
        statuses: [],
        dateRange: undefined,
    });
    setIsOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Filter Orders</DialogTitle>
          <DialogDescription>
            Filter your orders by status and date range.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div>
            <h4 className="font-semibold mb-3">Status</h4>
            <div className="grid grid-cols-2 gap-3">
              {ALL_STATUSES.map(status => (
                <div key={status} className="flex items-center space-x-2">
                  <Checkbox
                    id={`status-${status}`}
                    checked={selectedStatuses.includes(status)}
                    onCheckedChange={(checked) => handleStatusChange(status, checked)}
                  />
                  <Label htmlFor={`status-${status}`} className="font-normal">
                    {status}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Date Range</h4>
             <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, "LLL dd, y")} -{" "}
                        {format(date.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(date.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={setDate}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={handleClear}>Clear Filters</Button>
          <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button onClick={handleApply}>Apply Filters</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
