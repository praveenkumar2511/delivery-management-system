import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface SimpleDatePickerProps {
  label?: string;
  value?: string;
  onChange: (formattedDate: string) => void;
  className?: string;
}

const SimpleDatePicker = ({
  label,
  value = "",
  onChange,
  className,
}: SimpleDatePickerProps) => {
  // Initialize with null or parse from the initial value if provided
  const [date, setDate] = useState<Date | undefined>(() => {
    if (!value) return undefined;

    // Try to parse from DD/MM/YYYY format
    const [day, month, year] = value.split("/").map(Number);
    if (day && month && year) {
      // Note: month is 0-indexed in JavaScript Date
      return new Date(year, month - 1, day);
    }
    return undefined;
  });

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);

    if (selectedDate) {
      // Format as DD/MM/YYYY
      const day = String(selectedDate.getDate()).padStart(2, "0");
      const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
      const year = selectedDate.getFullYear();

      const formattedDate = `${day}/${month}/${year}`;
      onChange(formattedDate);
    } else {
      onChange("");
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && <div className="text-sm font-medium">{label}</div>}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full h-[43px] text-left font-normal justify-start",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "dd/MM/yyyy") : "Select date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default SimpleDatePicker;
