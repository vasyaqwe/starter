import { Field as FieldPrimitive } from "@base-ui-components/react/field"
import { inputStyles } from "../constants"
import { cn } from "../utils"

export function Field({
   className,
   ...props
}: React.ComponentProps<typeof FieldPrimitive.Root>) {
   return (
      <FieldPrimitive.Root
         className={cn("flex w-full flex-col items-start gap-1", className)}
         {...props}
      />
   )
}

export function FieldLabel({
   className,
   ...props
}: React.ComponentProps<typeof FieldPrimitive.Label>) {
   return (
      <FieldPrimitive.Label
         className={cn("font-medium text-sm", className)}
         {...props}
      />
   )
}

export function FieldControl({
   className,
   ...props
}: React.ComponentProps<typeof FieldPrimitive.Control>) {
   return (
      <FieldPrimitive.Control
         className={cn(inputStyles, className)}
         {...props}
      />
   )
}

export function FieldError({
   className,
   ...props
}: React.ComponentProps<typeof FieldPrimitive.Error>) {
   return (
      <FieldPrimitive.Error
         className={cn("text-red-11 text-sm dark:text-red-9", className)}
         {...props}
      />
   )
}

export function FieldDescription({
   className,
   ...props
}: React.ComponentProps<typeof FieldPrimitive.Description>) {
   return (
      <FieldPrimitive.Description
         className={cn("mt-1 text-foreground/75 text-sm", className)}
         {...props}
      />
   )
}
