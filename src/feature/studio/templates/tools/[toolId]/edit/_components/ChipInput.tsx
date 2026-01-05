"use client";

import { useState, KeyboardEvent } from "react";
import { X } from "lucide-react";

interface ChipInputProps {
  id: string;
  chips: string[];
  onChipsChange: (chips: string[]) => void;
  placeholder?: string;
  chipClassName?: string;
}

export function ChipInput({
  id,
  chips,
  onChipsChange,
  placeholder = "",
  chipClassName = "bg-primary/10 text-primary border-primary/20",
}: ChipInputProps) {
  const [inputValue, setInputValue] = useState("");

  const handleAddChip = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !chips.includes(trimmed)) {
      onChipsChange([...chips, trimmed]);
      setInputValue("");
    }
  };

  const handleRemoveChip = (chipToRemove: string) => {
    onChipsChange(chips.filter((chip) => chip !== chipToRemove));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === "," || e.key === " ") {
      e.preventDefault();
      handleAddChip();
    }
  };

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
              onClick={() => handleRemoveChip(chip)}
              className="hover:bg-black/10 dark:hover:bg-white/10 rounded-sm transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        <input
          id={id}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleAddChip}
          placeholder={chips.length === 0 ? placeholder : ""}
          className="flex-1 min-w-[120px] outline-none bg-transparent placeholder:text-muted-foreground"
        />
      </div>
    </div>
  );
}
