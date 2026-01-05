import { Label } from "@/shared/ui/label";
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface FormFieldProps {
  icon?: LucideIcon;
  label: string;
  htmlFor: string;
  children: ReactNode;
  className?: string;
  required?: boolean;
  helpText?: string;
}

export function FormField({
  icon: Icon,
  label,
  htmlFor,
  children,
  className = "",
  required = false,
  helpText,
}: FormFieldProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={htmlFor} className="flex items-center gap-2">
        {Icon && <Icon className="h-4 w-4" />}
        <span>
          {label}
          {required && " *"}
        </span>
      </Label>
      {children}
      {helpText && (
        <p className="text-xs text-muted-foreground">{helpText}</p>
      )}
    </div>
  );
}
