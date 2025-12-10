import { Button } from "@/shared/ui/button";
import { Loader2, LucideIcon } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface ActionButtonProps {
  onClick: () => void;
  disabled: boolean;
  isLoading: boolean;
  icon: LucideIcon;
  label: string;
  loadingLabel: string;
  className: string;
}

export function ActionButton({
  onClick,
  disabled,
  isLoading,
  icon: Icon,
  label,
  loadingLabel,
  className,
}: ActionButtonProps) {
  return (
    <Button
      className={cn(
        "cursor-pointer bg-linear-to-r text-white border-0 shadow-md hover:shadow-lg transition-all duration-200",
        className
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {isLoading && (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          {loadingLabel}
        </>
      )}
      {!isLoading && (
        <>
          <Icon className="h-4 w-4 mr-2" />
          {label}
        </>
      )}
    </Button>
  );
}

