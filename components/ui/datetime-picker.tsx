import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { format } from 'date-fns';

const DateTimePicker: React.FC = ({ onSubmit }: any) => {
  const [date, setDate] = useState<Date | null>();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [time, setTime] = useState<string>();

  // Generate time options every 30 minutes
  const timeOptions: string[] = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const formattedHour = hour.toString().padStart(2, '0');
      const formattedMinute = minute.toString().padStart(2, '0');
      timeOptions.push(`${formattedHour}:${formattedMinute}`);
    }
  }

  const handleSelect = (selectedDate: Date | undefined): void => {
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const handleTimeChange = (selectedTime: string): void => {
    setTime(selectedTime);
  };

  const handleSubmit = (): void => {
    // Combine date and time
    if (!time || !date) return
    const [hours, minutes] = time.split(':').map(Number);
    const dateTime = new Date(date);
    dateTime.setHours(hours, minutes);

    onSubmit(dateTime)
    setIsOpen(false);
  };

  return (
    <div className="flex flex-col items-start space-y-4">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline">
            {date && time ? format(date, 'PPP') + ' at ' + time : 'Select Scheduled Calls Date'}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="p-4 space-y-4">
            <Calendar
              mode="single"
              selected={date || undefined}
              onSelect={handleSelect}
              initialFocus
            />
            <div className="flex flex-col space-y-2">
              <p className="text-sm font-medium">Time</p>
              <Select value={time} onValueChange={handleTimeChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  {timeOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full" onClick={handleSubmit}>
              Confirm Selection
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DateTimePicker;