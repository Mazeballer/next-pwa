"use client"

import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, checked, onCheckedChange, ...props }, ref) => {
    const [isChecked, setIsChecked] = React.useState(checked || false)

    React.useEffect(() => {
      if (checked !== undefined) {
        setIsChecked(checked)
      }
    }, [checked])

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newChecked = event.target.checked
      setIsChecked(newChecked)
      onCheckedChange?.(newChecked)
    }

    return (
      <div className="relative flex items-center">
        <input
          type="checkbox"
          ref={ref}
          checked={isChecked}
          onChange={handleChange}
          className={cn("peer h-4 w-4 shrink-0 opacity-0 absolute", className)}
          {...props}
        />
        <div
          className={cn(
            "h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background",
            "flex items-center justify-center",
            "peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2",
            "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
            isChecked && "bg-primary text-primary-foreground",
          )}
        >
          {isChecked && <Check className="h-3 w-3" />}
        </div>
      </div>
    )
  },
)
Checkbox.displayName = "Checkbox"

export { Checkbox }
