import { Field as FieldPrimitive } from "@base-ui-components/react/field"
import { Fieldset as FieldsetPrimitive } from "@base-ui-components/react/fieldset"
import type { VariantProps } from "class-variance-authority"
import { cn } from "../utils"
import { inputVariants } from "./input"

export function Fieldset({
   className,
   ...props
}: React.ComponentProps<typeof FieldsetPrimitive.Root>) {
   return (
      <FieldsetPrimitive.Root
         className={cn("", className)}
         {...props}
      />
   )
}

export function FieldsetLegend({
   className,
   ...props
}: React.ComponentProps<typeof FieldsetPrimitive.Legend>) {
   return (
      <FieldsetPrimitive.Legend
         className={cn("font-medium text-lg", className)}
         {...props}
      />
   )
}

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
   variant,
   size,
   ...props
}: React.ComponentProps<typeof FieldPrimitive.Control> &
   VariantProps<typeof inputVariants>) {
   return (
      <FieldPrimitive.Control
         className={cn(inputVariants({ variant, size, className }))}
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
         className={cn("text-destructive text-sm", className)}
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
