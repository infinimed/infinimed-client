'use client';

import { useState } from 'react';
import { DayPicker, DateRange } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

interface DatePickerProps {
  selectedDate: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
  allowPastDates?: boolean;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  selectedDate,
  onDateChange,
  allowPastDates = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const today = new Date();

  const handleDayClick = (range: DateRange | undefined) => {
    if (range?.from) {
      onDateChange(range.from);
    } else {
      onDateChange(undefined);
    }
    setIsOpen(false);
  };

  const disabledDays = allowPastDates ? undefined : { before: today };

  return (
    <div className="relative">
      <input
        type="text"
        value={selectedDate ? selectedDate.toLocaleDateString('en-GB') : ''}
        onClick={() => setIsOpen((prev) => !prev)}
        readOnly
        placeholder="Select Date"
        className="w-full px-4 py-1 border h-14 text-xl border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {isOpen && (
        <div className="absolute z-10 bg-white shadow-lg rounded-lg mt-2">
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={(date) => handleDayClick({ from: date, to: date })}
            disabled={disabledDays}
            fromYear={allowPastDates ? 1900 : today.getFullYear()}
            toYear={today.getFullYear() + 1}
            captionLayout="dropdown"
          />
        </div>
      )}
    </div>
  );
};
