import { cva } from "class-variance-authority"
import { cn } from "../utils"

const cardVariants = cva(
   `rounded-2xl border border-gray-4 bg-gray-1 dark:bg-gray-3/60 p-6 shadow-xs dark:shadow-md has-[[data-card-header]]:p-0`,
)

function Card({ className, ...props }: React.ComponentProps<"div">) {
   return (
      <div
         className={cn(cardVariants(), className)}
         {...props}
      />
   )
}

function CardTitle({ className, ...props }: React.ComponentProps<"h2">) {
   return (
      <h2
         className={cn("font-medium text-lg leading-none", className)}
         {...props}
      />
   )
}

function CardDescription({ className, ...props }: React.ComponentProps<"p">) {
   return (
      <p
         className={cn("mt-2 text-gray-11 text-sm", className)}
         {...props}
      />
   )
}

function CardHeader({ className, ...props }: React.ComponentProps<"header">) {
   return (
      <header
         data-card-header
         className={cn("border-b p-4", className)}
         {...props}
      />
   )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
   return (
      <div
         className={cn("p-4", className)}
         {...props}
      />
   )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
   return (
      <div
         className={cn("border-t p-4", className)}
         {...props}
      />
   )
}

export {
   Card,
   CardTitle,
   CardDescription,
   CardHeader,
   CardContent,
   CardFooter,
   cardVariants,
}
