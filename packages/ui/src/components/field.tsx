import { Field as FieldPrimitive } from "@base-ui-components/react/field"
import { Fieldset as FieldsetPrimitive } from "@base-ui-components/react/fieldset"
import { Input as InputPrimitive } from "@base-ui-components/react/input"
import { type VariantProps, cva } from "class-variance-authority"
import { cn } from "../utils"

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

const inputVariants = cva(
   `w-full border outline-hidden rounded-[10px] placeholder:text-foreground/40`,
   {
      variants: {
         variant: {
            default: `border-primary-6 bg-white focus:border-primary-11 dark:bg-primary-2`,
            chat: "min-h-[41px] rounded-full border-primary-5 bg-primary-2 px-4 py-2 dark:border-primary-5 dark:bg-primary-3",
         },
         size: {
            default: "h-9 px-3 text-base",
         },
      },
      compoundVariants: [
         {
            variant: "chat",
            className: "h-auto px-4",
         },
      ],
      defaultVariants: {
         variant: "default",
         size: "default",
      },
   },
)

export function Input({
   className,
   variant,
   size,
   ...props
}: React.ComponentProps<typeof InputPrimitive> &
   VariantProps<typeof inputVariants>) {
   return (
      <InputPrimitive
         className={cn(inputVariants({ variant, size, className }))}
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
