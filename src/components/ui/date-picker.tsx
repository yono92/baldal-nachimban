"use client";

import * as React from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/src/style.css";
import { ko } from "date-fns/locale";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  value?: Date;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
  fromYear?: number;
  toYear?: number;
  disabled?: boolean;
}

export function DatePicker({
  value,
  onChange,
  placeholder = "날짜를 선택하세요",
  fromYear,
  toYear,
  disabled,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <Button
        type="button"
        variant="outline"
        disabled={disabled}
        className={cn(
          "w-full justify-start text-left font-normal",
          !value && "text-muted-foreground"
        )}
        onClick={() => setOpen((prev) => !prev)}
      >
        <CalendarIcon className="mr-2 h-4 w-4" />
        {value
          ? format(value, "yyyy년 M월 d일", { locale: ko })
          : placeholder}
      </Button>

      {open && (
        <div className="absolute top-full left-0 z-50 mt-1 rounded-lg border bg-background p-3 shadow-lg">
          <style>{`
            .rdp-root {
              --rdp-accent-color: hsl(var(--primary));
              --rdp-accent-background-color: hsl(var(--primary) / 0.1);
              --rdp-day-height: 36px;
              --rdp-day-width: 36px;
              --rdp-day_button-height: 34px;
              --rdp-day_button-width: 34px;
              --rdp-day_button-border-radius: 8px;
              font-size: 0.875rem;
            }
            .rdp-dropdown {
              appearance: none;
              background: transparent;
              font-weight: 500;
              font-size: 0.875rem;
              cursor: pointer;
              padding: 2px 4px;
              border-radius: 6px;
            }
            .rdp-dropdown:hover {
              background: hsl(var(--muted));
            }
          `}</style>
          <DayPicker
            mode="single"
            selected={value}
            onSelect={(date) => {
              onChange(date);
              if (date) setOpen(false);
            }}
            locale={ko}
            captionLayout="dropdown"
            startMonth={fromYear ? new Date(fromYear, 0) : undefined}
            endMonth={toYear ? new Date(toYear, 11) : undefined}
            defaultMonth={value || new Date()}
          />
        </div>
      )}
    </div>
  );
}
