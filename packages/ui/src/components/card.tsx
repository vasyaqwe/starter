import { cva } from "class-variance-authority"
import React from "react"
import { cn } from "../utils"

const cardVariants = cva(
   `rounded-xl border border-gray-4 bg-gray-2 p-6 shadow-sm has-[[data-card-header=true]]:p-0`,
)

const Card = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
   ({ className, ...props }, ref) => (
      <div
         ref={ref}
         className={cn(cardVariants(), className)}
         {...props}
      />
   ),
)

const CardTitle = React.forwardRef<
   HTMLHeadingElement,
   React.ComponentProps<"h2">
>(({ className, ...props }, ref) => (
   <h2
      ref={ref}
      className={cn("font-medium text-lg leading-none", className)}
      {...props}
   />
))

const CardDescription = React.forwardRef<
   HTMLParagraphElement,
   React.ComponentProps<"p">
>(({ className, ...props }, ref) => (
   <p
      ref={ref}
      className={cn("mt-2 text-gray-11 text-sm", className)}
      {...props}
   />
))

const CardHeader = React.forwardRef<
   HTMLHeadElement,
   React.ComponentProps<"header">
>(({ className, ...props }, ref) => (
   <header
      ref={ref}
      data-card-header="true"
      className={cn("border-b p-4", className)}
      {...props}
   />
))

const CardContent = React.forwardRef<
   HTMLDivElement,
   React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
   <div
      ref={ref}
      className={cn("p-4", className)}
      {...props}
   />
))

const CardFooter = React.forwardRef<
   HTMLDivElement,
   React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
   <div
      ref={ref}
      className={cn("border-t p-4", className)}
      {...props}
   />
))

export {
   Card,
   CardTitle,
   CardDescription,
   CardHeader,
   CardContent,
   CardFooter,
   cardVariants,
}
