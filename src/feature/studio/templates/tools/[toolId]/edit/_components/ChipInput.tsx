"use client";

import { KeyboardEvent } from "react";
import { X } from "lucide-react";

interface ChipInputProps {
  id: string;
  value: string;
  chips: string[];
  onChange: (value: string) => void;
  onAdd: () => void;
  onRemove: (chip: string) => void;
  onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
  placeholder?: string;
  chipClassName?: string;
}

export function ChipInput({
  id,
  value,
  chips,
  onChange,
  onAdd,
  onRemove,
  onKeyDown,
  placeholder = "",
  chipClassName = "bg-primary/10 text-primary border-primary/20",
}: ChipInputProps) {
  return (
    <div className="min-h-[42px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
      <div className="flex flex-wrap gap-1.5 items-center">
        {chips.map((chip) => (
          <span
            key={chip}
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-sm font-medium border ${chipClassName}`}
          >
            {chip}
            <button
              type="button"
              onClick={() => onRemove(chip)}
              className="hover:bg-black/10 dark:hover:bg-white/10 rounded-sm transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        <input
          id={id}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          onBlur={onAdd}
          placeholder={chips.length === 0 ? placeholder : ""}
          className="flex-1 min-w-[120px] outline-none bg-transparent placeholder:text-muted-foreground"
        />
      </div>
    </div>
  );
}
