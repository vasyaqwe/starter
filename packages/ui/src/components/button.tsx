import { type VariantProps, cva } from "class-variance-authority"
import React from "react"
import { cn } from "../utils"

const buttonVariants = cva(
   `relative inline-flex items-center justify-center font-medium gap-1.5 leading-none [&>span>span]:gap-1.5 overflow-hidden whitespace-nowrap ring-offset-background before:pointer-events-none before:absolute before:inset-0 before:z-[1] before:bg-gradient-to-b dark:before:from-foreground/15 before:from-background/[0.18] before:opacity-0 before:transition-opacity hover:before:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground disabled:pointer-events-none disabled:opacity-75`,
   {
      variants: {
         variant: {
            default: `max-md:active:scale-95 max-md:transition-[transform,background-color] max-md:duration-250 bg-primary text-primary-foreground transition-colors`,
            secondary: `max-md:active:scale-95 max-md:transition-[transform,background-color] max-md:duration-250 md:transition-none bg-muted/35 font-medium text-foreground/75 before:hidden hover:bg-muted/65 data-[state=open]:bg-muted/65 dark:bg-muted/50 dark:data-[state=open]:bg-muted dark:hover:bg-muted hover:text-foreground/95 data-[state=open]:text-foreground/85 dark:shadow-md`,
            "secondary-destructive": `transition-none bg-muted/30 dark:bg-muted/75 font-medium text-muted-foreground before:hidden dark:hover:bg-destructive/10 hover:bg-destructive/10 hover:text-destructive`,
            instagram: `max-md:active:scale-95 max-md:transition-[transform,background-color] max-md:duration-250 bg-transparent bg-gradient-to-tr from-[#ffc841] via-[#ee3873] to-[#a829ae] text-white`,
            twitter: `max-md:active:scale-95 max-md:transition-[transform,background-color] max-md:duration-250 bg-foreground/95 text-background`,
            outline: `max-md:active:scale-95 max-md:transition-[transform,background-color] max-md:duration-250 bg-background dark:bg-muted dark:border-foreground/[0.07] dark:shadow-md border text-foreground shadow-sm before:from-foreground/[0.03] dark:before:from-foreground/[0.07]`,
            destructive: `max-md:active:scale-95 max-md:transition-[transform,background-color] max-md:duration-250 bg-destructive text-destructive-foreground before:from-background/25 dark:before:from-foreground/20`,
            ghost: "border border-transparent before:hidden hover:bg-border/75 aria-[current=page]:bg-border/75 data-[state=open]:bg-border/75 max-md:transition-[transform,background-color] max-md:duration-250 max-md:active:scale-95 md:transition-none",
            link: "!h-auto !rounded-none !p-0 max-md:active:translate-[unset] text-foreground/75 underline transition-none before:hidden hover:text-foreground",
         },
         size: {
            xs: "h-[30px] rounded-lg px-2.5 text-sm before:rounded-lg",
            sm: "h-[32px] rounded-lg px-2.5 text-sm before:rounded-lg md:h-[30px]",
            default:
               "h-9 rounded-[10px] px-3 before:rounded-[10px] md:h-[34px] md:rounded-lg md:before:rounded-lg",
            lg: "h-[38px] gap-2 rounded-[10px] px-4 text-[0.9325rem] before:rounded-[10px] md:h-[34px] md:rounded-lg md:before:rounded-lg [&>span>span]:gap-2",
            xl: " h-[44px] gap-2 rounded-[10px] px-4 text-[1rem] before:rounded-[10px] md:h-[38px] md:rounded-lg md:before:rounded-lg [&>span>span]:gap-2",
            icon: "size-9 gap-0 rounded-[9px] before:rounded-[10px] md:size-8 md:rounded-lg md:before:rounded-lg",
            "with-icon":
               "h-[51px] flex-col gap-[3px] rounded-lg px-3 py-1.5 text-[0.785rem] leading-[1.25] [&>span>span]:flex-col [&>span>span]:gap-[3px]",
         },
      },
      defaultVariants: {
         variant: "default",
         size: "default",
      },
   },
)

type ButtonProps = React.ComponentProps<"button"> &
   VariantProps<typeof buttonVariants>

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
   ({ className, variant, size, ...props }, ref) => {
      return (
         <button
            className={cn(buttonVariants({ variant, size, className }))}
            ref={ref}
            {...props}
         />
      )
   },
)

export { Button, type ButtonProps, buttonVariants }
