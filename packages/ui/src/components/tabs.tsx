import { Tabs as TabsPrimitive } from "@base-ui-components/react/tabs"
import { focusStyles } from "../constants"
import { cn } from "../utils"

const Tabs = TabsPrimitive.Root

function TabsList({
   className,
   ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
   return (
      <TabsPrimitive.List
         className={cn("flex gap-1", className)}
         {...props}
      />
   )
}

function TabsTab({
   className,
   ...props
}: React.ComponentProps<typeof TabsPrimitive.Tab>) {
   return (
      <TabsPrimitive.Tab
         className={cn(
            "inline-flex h-8 cursor-(--cursor) items-center justify-center rounded-full px-2.5 aria-selected:bg-primary-12 aria-selected:text-primary-1 dark:aria-selected:bg-primary-5 dark:aria-selected:text-primary-12",
            "text-foreground/75 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-70 aria-selected:shadow-xs dark:aria-selected:shadow-md",
            focusStyles,
            className,
         )}
         {...props}
      />
   )
}

function TabsIndicator({
   className,
   ...props
}: React.ComponentProps<typeof TabsPrimitive.Indicator>) {
   return (
      <TabsPrimitive.Indicator
         className={cn("", className)}
         {...props}
      />
   )
}

function TabsPanel({
   className,
   ...props
}: React.ComponentProps<typeof TabsPrimitive.Panel>) {
   return (
      <TabsPrimitive.Panel
         className={cn("", className)}
         {...props}
      />
   )
}

export { Tabs, TabsList, TabsTab, TabsIndicator, TabsPanel }
