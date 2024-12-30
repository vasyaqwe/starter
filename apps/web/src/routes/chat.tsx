import { OnlineIndicator, UserAvatar } from "@/ui/components/user-avatar"
import { Button, buttonVariants } from "@project/ui/components/button"
import { Icons } from "@project/ui/components/icons"
import { Kbd } from "@project/ui/components/kbd"
import {
   Menu,
   MenuItem,
   MenuPopup,
   MenuTrigger,
} from "@project/ui/components/menu"
import { ScrollArea } from "@project/ui/components/scroll-area"
import {
   Tooltip,
   TooltipPopup,
   TooltipTrigger,
} from "@project/ui/components/tooltip"
import { cn } from "@project/ui/utils"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/chat")({
   component: RouteComponent,
})

const scroll = (node: HTMLElement | null) => {
   node?.scrollIntoView()
}

function RouteComponent() {
   const messages = [
      {
         content: "Hey you!",
         sender: {
            id: "1",
            name: "John",
            avatarUrl: "https://i.pravatar.cc/150?img=1",
         },
         createdAt: new Date("2024-12-28T09:00:00"),
      },
      {
         content: "Yes you!",
         sender: {
            id: "2",
            name: "Jane",
            avatarUrl: "https://i.pravatar.cc/150?img=2",
         },
         createdAt: new Date("2024-12-28T09:01:00"),
      },
      {
         content: "Yes you!",
         sender: {
            id: "2",
            name: "Jane",
            avatarUrl: "https://i.pravatar.cc/150?img=2",
         },
         createdAt: new Date("2024-12-28T09:01:00"),
      },
      {
         content: "What me?!",
         sender: {
            id: "1",
            name: "John",
            avatarUrl: "https://i.pravatar.cc/150?img=1",
         },
         createdAt: new Date("2024-12-28T09:02:00"),
      },
      {
         content:
            "What me?!What me?!What me?!What me?!What me?!What me?!What me?!What me?!What me?!What me?!What me?!What me?!What me?!What me?!What me?!What me?!What me?!",
         sender: {
            id: "1",
            name: "John",
            avatarUrl: "https://i.pravatar.cc/150?img=1",
         },
         createdAt: new Date("2024-12-28T09:02:00"),
      },
      {
         content: "What me?!",
         sender: {
            id: "1",
            name: "John",
            avatarUrl: "https://i.pravatar.cc/150?img=1",
         },
         createdAt: new Date("2024-12-28T09:02:00"),
      },
      {
         content: "No way.",
         sender: {
            id: "2",
            name: "Jane",
            avatarUrl: "https://i.pravatar.cc/150?img=2",
         },
         createdAt: new Date("2024-12-27T15:00:00"),
      },
      {
         content: "Hello there",
         sender: {
            id: "1",
            name: "John",
            avatarUrl: "https://i.pravatar.cc/150?img=1",
         },
         createdAt: new Date("2024-12-27T15:30:00"),
      },
      {
         content:
            "What me?!What me?!What me?!What me?!What me?!What me?!What me?!What me?!What me?!What me?!What me?!What me?!What me?!What me?!What me?!What me?!What me?!",
         sender: {
            id: "1",
            name: "John",
            avatarUrl: "https://i.pravatar.cc/150?img=1",
         },
         createdAt: new Date("2024-12-28T09:02:00"),
      },
      {
         content: "What me?!",
         sender: {
            id: "1",
            name: "John",
            avatarUrl: "https://i.pravatar.cc/150?img=1",
         },
         createdAt: new Date("2024-12-28T09:02:00"),
      },
      {
         content: "No way.",
         sender: {
            id: "2",
            name: "Jane",
            avatarUrl: "https://i.pravatar.cc/150?img=2",
         },
         createdAt: new Date("2024-12-27T15:00:00"),
      },
      {
         content: "Hello there",
         sender: {
            id: "1",
            name: "John",
            avatarUrl: "https://i.pravatar.cc/150?img=1",
         },
         createdAt: new Date("2024-12-27T15:30:00"),
      },
      {
         content: "Hey you!",
         sender: {
            id: "1",
            name: "John",
            avatarUrl: "https://i.pravatar.cc/150?img=1",
         },
         createdAt: new Date("2024-12-28T09:00:00"),
      },
      {
         content: "Yes you!",
         sender: {
            id: "2",
            name: "Jane",
            avatarUrl: "https://i.pravatar.cc/150?img=2",
         },
         createdAt: new Date("2024-12-28T09:01:00"),
      },
      {
         content: "What me?!",
         sender: {
            id: "1",
            name: "John",
            avatarUrl: "https://i.pravatar.cc/150?img=1",
         },
         createdAt: new Date("2024-12-28T09:02:00"),
      },
      {
         content:
            "What me?!What me?!What me?!What me?!What me?!What me?!What me?!What me?!What me?!What me?!What me?!What me?!What me?!What me?!What me?!What me?!What me?!",
         sender: {
            id: "1",
            name: "John",
            avatarUrl: "https://i.pravatar.cc/150?img=1",
         },
         createdAt: new Date("2024-12-28T09:02:00"),
      },
      {
         content: "What me?!",
         sender: {
            id: "1",
            name: "John",
            avatarUrl: "https://i.pravatar.cc/150?img=1",
         },
         createdAt: new Date("2024-12-28T09:02:00"),
      },
      {
         content: "No way.",
         sender: {
            id: "2",
            name: "Jane",
            avatarUrl: "https://i.pravatar.cc/150?img=2",
         },
         createdAt: new Date("2024-12-27T15:00:00"),
      },
      {
         content: "Hello there",
         sender: {
            id: "1",
            name: "John",
            avatarUrl: "https://i.pravatar.cc/150?img=1",
         },
         createdAt: new Date("2024-12-27T15:30:00"),
      },
   ].map((m) => ({ ...m, id: crypto.randomUUID() }))

   const groupedMessages = Object.entries(
      messages.reduce(
         (acc, msg) => {
            const date = msg.createdAt.toDateString()
            const prevGroup = acc[date]?.at(-1)
            const prevMsg = prevGroup?.at(-1)

            if (!acc[date]) {
               acc[date] = [[msg]]
            } else if (!prevMsg || prevMsg.sender.name !== msg.sender.name) {
               acc[date]?.push([msg])
            } else {
               prevGroup?.push(msg)
            }

            return acc
         },
         {} as Record<string, (typeof messages)[]>,
      ),
   ).map(([date, groups]) => ({
      date,
      groups: groups.map((msgs) => ({
         sender: msgs[0]?.sender,
         messages: msgs,
      })),
   }))

   const currentUserId = "1"

   return (
      <>
         <ScrollArea className="pb-8">
            <div className="mx-auto w-full max-w-4xl px-4">
               {groupedMessages.map((dateGroup) => (
                  <div key={dateGroup.date}>
                     <p className="mt-7 text-center font-semibold text-foreground/60 text-sm uppercase">
                        {dateGroup.date}
                     </p>
                     {dateGroup.groups.map((group, index) =>
                        !group.sender ? null : (
                           <div
                              key={index}
                              className={cn(
                                 "flex gap-2",
                                 currentUserId === group.sender.id
                                    ? "flex-row-reverse"
                                    : "",
                              )}
                           >
                              <UserAvatar
                                 className="mt-auto mb-[3px]"
                                 user={group.sender}
                              >
                                 <OnlineIndicator />
                              </UserAvatar>
                              <div className="mt-1 w-full">
                                 {group.messages.map(
                                    (message, index, messages) => {
                                       const isLast =
                                          index === group.messages.length - 1
                                       const isFirst = index === 0
                                       const isTheOnlyOne =
                                          messages.length === 1
                                       const isMessageMine =
                                          currentUserId === group.sender?.id

                                       const conditionalClassNames = cn(
                                          "w-fit max-w-xl px-3 py-2 dark:shadow-md",
                                          isMessageMine
                                             ? "rounded-r-md rounded-l-3xl bg-accent text-white"
                                             : "rounded-r-3xl rounded-l-md bg-gray-3 dark:bg-gray-5",
                                          isTheOnlyOne ? "!rounded-3xl" : "",
                                          isFirst && !isMessageMine
                                             ? "rounded-tl-3xl"
                                             : "",
                                          isLast && !isMessageMine
                                             ? "rounded-bl-3xl"
                                             : "",
                                          isFirst && isMessageMine
                                             ? "rounded-tr-3xl"
                                             : "",
                                          isLast && isMessageMine
                                             ? "rounded-br-3xl"
                                             : "",
                                       )

                                       return (
                                          <div
                                             key={message.id}
                                             className={cn(
                                                "group mt-0.5 flex items-center justify-end gap-2",
                                                isMessageMine
                                                   ? ""
                                                   : "flex-row-reverse",
                                             )}
                                          >
                                             <div className="opacity-0 group-hover:opacity-100 has-[[data-popup-open]]:opacity-100">
                                                <Menu>
                                                   <MenuTrigger
                                                      className={buttonVariants(
                                                         {
                                                            variant: "ghost",
                                                            size: "icon-sm",
                                                         },
                                                      )}
                                                   >
                                                      <Icons.ellipsisHorizontal className="size-[22px]" />
                                                   </MenuTrigger>
                                                   <MenuPopup
                                                      align={
                                                         isMessageMine
                                                            ? "end"
                                                            : "start"
                                                      }
                                                   >
                                                      <MenuItem destructive>
                                                         <Icons.trash />
                                                         Delete
                                                      </MenuItem>
                                                   </MenuPopup>
                                                </Menu>
                                             </div>
                                             <div
                                                className={cn(
                                                   "w-fit max-w-xl shrink-0 px-3 py-2 dark:shadow-md",
                                                   conditionalClassNames,
                                                )}
                                             >
                                                {message.content}
                                             </div>
                                          </div>
                                       )
                                    },
                                 )}
                              </div>
                           </div>
                        ),
                     )}
                  </div>
               ))}
            </div>
            <div ref={scroll} />
         </ScrollArea>
         <div className="border-gray-4 border-t bg-background">
            <div className="mx-auto flex max-w-4xl items-center gap-2 p-2 md:p-4">
               <div className="flex items-center gap-0.5">
                  <Tooltip>
                     <TooltipTrigger
                        render={
                           <Button
                              size={"icon"}
                              variant={"ghost"}
                           />
                        }
                     >
                        <Icons.paperClip className="size-[22px]" />
                     </TooltipTrigger>
                     <TooltipPopup>Attach files</TooltipPopup>
                  </Tooltip>
                  <Tooltip>
                     <TooltipTrigger
                        render={
                           <Button
                              size={"icon"}
                              variant={"ghost"}
                           />
                        }
                     >
                        <Icons.facePlus className="size-[22px]" />
                     </TooltipTrigger>
                     <TooltipPopup>Add emoji</TooltipPopup>
                  </Tooltip>
               </div>
               <div className="relative flex-1">
                  <input
                     autoFocus
                     className="min-h-[41px] w-full rounded-full border border-gray-4 bg-gray-2 px-4 py-2 outline-hidden dark:border-gray-5 dark:bg-gray-3"
                     placeholder="Chat.."
                  />
                  <Tooltip>
                     <TooltipTrigger
                        render={
                           <Button
                              className="absolute right-1 bottom-1 size-[33px]"
                              size={"icon-sm"}
                              aria-label="Send message"
                           />
                        }
                     >
                        <svg
                           viewBox="0 0 24 24"
                           fill="none"
                           className="size-5"
                        >
                           <path
                              d="M6 9.8304C7.55556 7.727 9.37278 5.83783 11.4057 4.20952C11.5801 4.06984 11.79 4 12 4M18 9.8304C16.4444 7.727 14.6272 5.83783 12.5943 4.20952C12.4199 4.06984 12.21 4 12 4M12 4V20"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                           />
                        </svg>
                     </TooltipTrigger>
                     <TooltipPopup className={"pr-[3px]"}>
                        Send <Kbd>Enter</Kbd>
                     </TooltipPopup>
                  </Tooltip>
               </div>
            </div>
         </div>
      </>
   )
}
