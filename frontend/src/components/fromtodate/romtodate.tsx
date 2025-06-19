import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { format, isFuture, isAfter, isBefore } from "date-fns";

interface DateRangePickerProps {
  fromLabel?: string;
  toLabel?: string;
  fromValue?: string;
  toValue?: string;
  onFromChange: (formattedDate: string) => void;
  onToChange: (formattedDate: string) => void;
  className?: string;
  required?: boolean;
  disableFutureDates?: boolean;
}

interface ValidationState {
  fromDateError: string;
  toDateError: string;
}

// Helper function to parse DD/MM/YYYY to Date
const parseDateString = (dateString: string): Date | null => {
  if (!dateString) return null;

  const [day, month, year] = dateString.split("/").map(Number);
  if (!day || !month || !year) return null;

  // Month is 0-indexed in JavaScript Date
  return new Date(year, month - 1, day);
};

// Format Date to DD/MM/YYYY
const formatDate = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const DateRangePicker = ({
  fromLabel = "From Date",
  toLabel = "To Date",
  fromValue = "",
  toValue = "",
  onFromChange,
  onToChange,
  className,
  required = false,
  disableFutureDates = true,
}: DateRangePickerProps) => {
  // State for the dates
  const [fromDate, setFromDate] = useState<Date | undefined>(
    parseDateString(fromValue) || undefined
  );
  const [toDate, setToDate] = useState<Date | undefined>(
    parseDateString(toValue) || undefined
  );

  // Track which fields have been touched/interacted with
  const [touched, setTouched] = useState({
    fromDate: false,
    toDate: false,
  });

  // Validation state
  const [validation, setValidation] = useState<ValidationState>({
    fromDateError: "",
    toDateError: "",
  });

  // Get today's date for disabling future dates
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Validate the date range
  useEffect(() => {
    const newValidation: ValidationState = {
      fromDateError: "",
      toDateError: "",
    };

    // Only validate fields that have been touched or have values
    if (touched.fromDate || fromDate) {
      // Validate required fields
      if (required && !fromDate) {
        newValidation.fromDateError = "From date is required";
      }

      // Validate against future dates if needed
      if (disableFutureDates && fromDate && isFuture(fromDate)) {
        newValidation.fromDateError = "From date cannot be in the future";
      }
    }

    if (touched.toDate || toDate) {
      // Validate required fields
      if (required && !toDate) {
        newValidation.toDateError = "To date is required";
      }

      // Validate against future dates if needed
      if (disableFutureDates && toDate && isFuture(toDate)) {
        newValidation.toDateError = "To date cannot be in the future";
      }
    }

    // Validate date range logic only if both dates are selected
    if (fromDate && toDate && (touched.fromDate || touched.toDate)) {
      if (isAfter(fromDate, toDate)) {
        newValidation.toDateError = "To date must be after from date";
      }
    }

    setValidation(newValidation);
  }, [fromDate, toDate, touched, required, disableFutureDates]);

  const handleFromDateSelect = (selectedDate: Date | undefined) => {
    setFromDate(selectedDate);
    setTouched({ ...touched, fromDate: true });

    if (selectedDate) {
      onFromChange(formatDate(selectedDate));
    } else {
      onFromChange("");
    }
  };

  const handleToDateSelect = (selectedDate: Date | undefined) => {
    setToDate(selectedDate);
    setTouched({ ...touched, toDate: true });

    if (selectedDate) {
      onToChange(formatDate(selectedDate));
    } else {
      onToChange("");
    }
  };

  // Function to determine if a date should be disabled in the calendar
  const disableDate = (date: Date) => {
    if (disableFutureDates && isAfter(date, today)) {
      return true;
    }
    return false;
  };

  return (
    <div className={cn("flex gap-5 w-full ", className)}>
      {/* From Date Picker */}
      <div className="w-full">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium">
            {fromLabel}
            {required && <span className="text-destructive"> *</span>}
          </div>
          {validation.fromDateError && (
            <div className="text-xs text-destructive">
              {validation.fromDateError}
            </div>
          )}
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              onClick={() => setTouched({ ...touched, fromDate: true })}
              className={cn(
                "w-full h-[43px] text-left font-normal justify-start",
                !fromDate && "text-muted-foreground",
                validation.fromDateError && "border-destructive"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {fromDate ? format(fromDate, "dd/MM/yyyy") : "Select date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={fromDate}
              onSelect={handleFromDateSelect}
              disabled={disableDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* To Date Picker */}
      <div className="w-full">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium">
            {toLabel}
            {required && <span className="text-destructive"> *</span>}
          </div>
          {validation.toDateError && (
            <div className="text-xs text-destructive">
              {validation.toDateError}
            </div>
          )}
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              onClick={() => setTouched({ ...touched, toDate: true })}
              className={cn(
                "w-full h-[43px] text-left font-normal justify-start",
                !toDate && "text-muted-foreground",
                validation.toDateError && "border-destructive"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {toDate ? format(toDate, "dd/MM/yyyy") : "Select date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={toDate}
              onSelect={handleToDateSelect}
              disabled={(date) => {
                // Disable future dates if needed
                if (disableFutureDates && isAfter(date, today)) {
                  return true;
                }
                // Optionally disable dates before the fromDate
                if (fromDate && isBefore(date, fromDate)) {
                  return true;
                }
                return false;
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default DateRangePicker;
