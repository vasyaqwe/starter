import { formatDate } from "@/misc/format"
import {
   Message,
   MessageActions,
   MessageContent,
   MessageGroup,
   MessageGroupDate,
} from "@/ui/components/message"
import { OnlineIndicator, UserAvatar } from "@/ui/components/user-avatar"
import { Button, buttonVariants } from "@project/ui/components/button"
import {
   FILE_TRIGGER_HOTKEY,
   FileTrigger,
   FileTriggerTooltipContent,
} from "@project/ui/components/file-trigger"
import { Icons } from "@project/ui/components/icons"
import { Input } from "@project/ui/components/input"
import { Kbd } from "@project/ui/components/kbd"
import {
   Menu,
   MenuItem,
   MenuPopup,
   MenuTrigger,
} from "@project/ui/components/menu"
import {
   Popover,
   PopoverPopup,
   PopoverTrigger,
} from "@project/ui/components/popover"
import { ScrollArea } from "@project/ui/components/scroll-area"
import {
   Tooltip,
   TooltipPopup,
   TooltipTrigger,
} from "@project/ui/components/tooltip"
import { cn } from "@project/ui/utils"
import { createFileRoute } from "@tanstack/react-router"
import * as React from "react"
import { useHotkeys } from "react-hotkeys-hook"

export const Route = createFileRoute("/_layout/chat")({
   component: RouteComponent,
   head: () => ({
      meta: [{ title: "Chat" }],
   }),
})

const scroll = (node: HTMLElement | null) => node?.scrollIntoView()

function RouteComponent() {
   const [messages, setMessages] = React.useState(
      [
         {
            content:
               "I've just pushed the UI changes for review. Main nav is completely refactored now.",
            sender: {
               id: "1",
               name: "John",
               avatarUrl: "https://i.pravatar.cc/150?img=1",
            },
            createdAt: new Date("2024-12-27T15:30:00"),
         },
         {
            content:
               "Great, I'll take a look. Did you address the mobile menu issues?",
            sender: {
               id: "2",
               name: "Jane",
               avatarUrl: "https://i.pravatar.cc/150?img=2",
            },
            createdAt: new Date("2024-12-27T15:35:00"),
         },
         {
            content: "Yes, should be fixed now. The animation is smoother too.",
            sender: {
               id: "1",
               name: "John",
               avatarUrl: "https://i.pravatar.cc/150?img=1",
            },
            createdAt: new Date("2024-12-27T15:36:00"),
         },
         {
            content:
               "Hey, how's the project coming along? I noticed some design inconsistencies in the latest build.",
            sender: {
               id: "1",
               name: "John",
               avatarUrl: "https://i.pravatar.cc/150?img=1",
            },
            createdAt: new Date("2024-12-28T09:00:00"),
         },
         {
            content:
               "Yeah, I've been meaning to discuss that. The spacing issues, right?",
            sender: {
               id: "2",
               name: "Jane",
               avatarUrl: "https://i.pravatar.cc/150?img=2",
            },
            createdAt: new Date("2024-12-28T09:01:00"),
         },
         {
            content:
               "Exactly. Especially in the dashboard components. Want to hop on a quick call to review? I've just pushed the UI changes for review. Main nav is completely refactored now. I've just pushed the UI changes for review. Main nav is completely refactored now.",
            sender: {
               id: "1",
               name: "John",
               avatarUrl: "https://i.pravatar.cc/150?img=1",
            },
            createdAt: new Date("2024-12-28T09:02:00"),
         },
         {
            content: "Sure, give me 10 minutes to wrap up what I'm working on.",
            sender: {
               id: "2",
               name: "Jane",
               avatarUrl: "https://i.pravatar.cc/150?img=2",
            },
            createdAt: new Date("2024-12-28T09:03:00"),
         },
         {
            content: "Sure, give me 10 minutes to wrap up what I'm working on.",
            sender: {
               id: "2",
               name: "Jane",
               avatarUrl: "https://i.pravatar.cc/150?img=2",
            },
            createdAt: new Date("2024-12-28T09:03:00"),
         },
      ].map((m) => ({ ...m, id: crypto.randomUUID() })),
   )

   const groupedMessages = Object.entries(
      messages.reduce(
         (acc, msg) => {
            const date = formatDate(msg.createdAt)
            if (!acc[date]) acc[date] = []
            const lastGroup = acc[date]?.at(-1)

            if (lastGroup?.sender.name === msg.sender.name) {
               lastGroup.messages.push(msg)
            } else {
               acc[date]?.push({ sender: msg.sender, messages: [msg] })
            }
            return acc
         },
         {} as Record<
            string,
            {
               sender: (typeof messages)[0]["sender"]
               messages: typeof messages
            }[]
         >,
      ),
   ).map(([date, groups]) => ({
      date,
      groups,
   }))

   const currentUserId = "1"
   const scrollAreaRef = React.useRef<HTMLDivElement>(null)

   const scrollToBottom = () => {
      setTimeout(() => {
         scrollAreaRef.current?.firstElementChild?.lastElementChild?.scrollIntoView(
            {
               behavior: "smooth",
            },
         )
      }, 0)
   }

   const fileTriggerRef = React.useRef<HTMLButtonElement>(null)
   useHotkeys(FILE_TRIGGER_HOTKEY, () => fileTriggerRef.current?.click(), {
      enableOnContentEditable: true,
      enableOnFormTags: true,
   })

   const [files, setFiles] = React.useState<File[]>([])

   return (
      <>
         <ScrollArea
            ref={scrollAreaRef}
            className="pb-8"
         >
            <div className="mx-auto w-full max-w-4xl px-3 sm:px-4">
               {groupedMessages.map((dateGroup) => (
                  <div key={dateGroup.date}>
                     <MessageGroupDate>{dateGroup.date}</MessageGroupDate>
                     <span className="mx-auto mb-2 block w-fit text-foreground/70 text-xs">
                        {formatDate(
                           dateGroup.groups[0]?.messages[0]?.createdAt ??
                              new Date(),
                           {
                              timeStyle: "short",
                           },
                        )}
                     </span>
                     {dateGroup.groups.map((group, index) => (
                        <MessageGroup
                           key={index}
                           isMine={currentUserId === group.sender.id}
                        >
                           <UserAvatar
                              className={cn(
                                 "mt-auto mb-[3px]",
                                 currentUserId === group.sender.id
                                    ? "hidden"
                                    : "",
                              )}
                              user={group.sender}
                           >
                              <OnlineIndicator />
                           </UserAvatar>
                           <div className="mt-4 w-full">
                              {group.messages.map(
                                 (message, index, messages) => {
                                    const isMine =
                                       currentUserId === group.sender?.id

                                    return (
                                       <Message
                                          key={message.id}
                                          isMine={isMine}
                                       >
                                          <MessageActions>
                                             <Menu>
                                                <MenuTrigger
                                                   className={cn(
                                                      buttonVariants({
                                                         variant: "ghost",
                                                         size: "icon-sm",
                                                      }),
                                                      "rounded-full",
                                                   )}
                                                >
                                                   <Icons.ellipsisHorizontal className="size-[22px]" />
                                                </MenuTrigger>
                                                <MenuPopup
                                                   align={
                                                      isMine ? "end" : "start"
                                                   }
                                                >
                                                   <MenuItem
                                                      destructive
                                                      onClick={() =>
                                                         setMessages((prev) =>
                                                            prev.filter(
                                                               (m) =>
                                                                  m.id !==
                                                                  message.id,
                                                            ),
                                                         )
                                                      }
                                                   >
                                                      <Icons.trash />
                                                      Delete
                                                   </MenuItem>
                                                </MenuPopup>
                                             </Menu>
                                          </MessageActions>
                                          <Tooltip>
                                             <TooltipTrigger
                                                render={
                                                   <MessageContent
                                                      isMine={isMine}
                                                      isFirst={index === 0}
                                                      isLast={
                                                         index ===
                                                         group.messages.length -
                                                            1
                                                      }
                                                      isOnlyOne={
                                                         messages.length === 1
                                                      }
                                                   />
                                                }
                                             >
                                                {message.content}
                                             </TooltipTrigger>
                                             <TooltipPopup
                                                align={isMine ? "end" : "start"}
                                             >
                                                {formatDate(message.createdAt, {
                                                   dateStyle: "medium",
                                                   timeStyle: "short",
                                                })}
                                             </TooltipPopup>
                                          </Tooltip>
                                       </Message>
                                    )
                                 },
                              )}
                           </div>
                        </MessageGroup>
                     ))}
                  </div>
               ))}
            </div>
            <div ref={scroll} />
         </ScrollArea>
         <div className="border-neutral border-t bg-background">
            <div className="mx-auto flex max-w-4xl items-end gap-2 p-2 md:p-4">
               <div className="mb-0.5 flex items-center gap-0.5">
                  <Tooltip>
                     <TooltipTrigger
                        render={
                           <FileTrigger
                              onChange={(e) =>
                                 setFiles((prev) => [
                                    ...prev,
                                    ...(e.target.files ?? []),
                                 ])
                              }
                              size={"icon"}
                              variant={"ghost"}
                              className="rounded-full"
                              ref={fileTriggerRef}
                           />
                        }
                     >
                        <Icons.paperClip className="size-[22px]" />
                     </TooltipTrigger>
                     <TooltipPopup className={"pr-[3px]"}>
                        <FileTriggerTooltipContent />
                     </TooltipPopup>
                  </Tooltip>
                  <Popover>
                     <Tooltip>
                        <TooltipTrigger
                           render={
                              <PopoverTrigger
                                 render={
                                    <Button
                                       className="rounded-full"
                                       size={"icon"}
                                       variant={"ghost"}
                                    />
                                 }
                              >
                                 <Icons.facePlus className="size-[22px]" />
                              </PopoverTrigger>
                           }
                        />
                        <TooltipPopup>Add emoji</TooltipPopup>
                     </Tooltip>
                     <PopoverPopup className={"grid grid-cols-4"}>
                        {[
                           "😑",
                           "😑",
                           "😑",
                           "😑",
                           "😑",
                           "😑",
                           "😑",
                           "😑",
                           "😑",
                           "😑",
                           "😑",
                        ].map((emoji, index) => (
                           <Button
                              key={index}
                              variant={"menu-item"}
                              size={"icon-sm"}
                              className="justify-center rounded-full"
                           >
                              <span className="-mt-px block">{emoji}</span>
                           </Button>
                        ))}
                     </PopoverPopup>
                  </Popover>
               </div>
               <form
                  onSubmit={(e) => {
                     e.preventDefault()
                     const rand = Math.random()
                     setMessages([
                        ...messages,
                        {
                           id: crypto.randomUUID(),
                           content:
                              Object.fromEntries(
                                 new FormData(e.target as HTMLFormElement),
                              ).content?.toString() ?? "",
                           sender: {
                              id: rand > 0.5 ? "1" : "2",
                              name: rand > 0.5 ? "John" : "Jane",
                              avatarUrl:
                                 rand > 0.5
                                    ? "https://i.pravatar.cc/150?img=1"
                                    : "https://i.pravatar.cc/150?img=2",
                           },
                           createdAt: new Date(),
                        },
                     ])
                     ;(e.target as HTMLFormElement).reset()
                     setFiles([])
                     scrollToBottom()
                  }}
                  className="relative flex-1"
               >
                  {files.length === 0 ? null : (
                     <div className="mb-4 flex flex-wrap gap-2">
                        {files.map((file, idx) => (
                           <Tooltip
                              key={idx}
                              delay={0}
                           >
                              <TooltipTrigger
                                 render={
                                    <div className="group relative grid size-20 place-items-center rounded-xl border border-neutral dark:bg-primary-3" />
                                 }
                              >
                                 <Button
                                    onClick={() => {
                                       setFiles((prev) =>
                                          prev.filter((f) => f !== file),
                                       )
                                    }}
                                    type="button"
                                    size={"icon-xs"}
                                    aria-label={`Remove ${file.name}`}
                                    className="-top-2 -left-2 invisible absolute rounded-full border-neutral bg-white p-1 text-foreground shadow-none hover:border-red-9 hover:bg-red-9 hover:text-white group-hover:visible dark:border-transparent dark:bg-primary-7 dark:shadow-xs dark:hover:border-red-9 dark:hover:bg-red-9"
                                 >
                                    <Icons.xMark className="size-4" />
                                 </Button>
                                 <svg
                                    className="size-6"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                 >
                                    <g fill="currentColor">
                                       <path
                                          d="m4,7h3c.552,0,1-.448,1-1v-3"
                                          stroke="currentColor"
                                          strokeLinejoin="round"
                                          strokeWidth="1.5"
                                          fill="currentColor"
                                       />
                                       <path
                                          d="m16,8.943v-2.943c0-1.657-1.343-3-3-3h-4.586c-.265,0-.52.105-.707.293l-3.414,3.414c-.188.188-.293.442-.293.707v6.586c0,1.657,1.343,3,3,3h1.24"
                                          fill="none"
                                          stroke="currentColor"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth="1.5"
                                       />
                                       <path
                                          d="m14,14v-1.5c0-.828-.672-1.5-1.5-1.5h0c-.828,0-1.5.672-1.5,1.5v1.5c0,1.657,1.343,3,3,3h0c1.657,0,3-1.343,3-3v-1"
                                          fill="none"
                                          stroke="currentColor"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth="2"
                                       />
                                    </g>
                                 </svg>
                              </TooltipTrigger>
                              <TooltipPopup sideOffset={13}>
                                 {file.name}
                              </TooltipPopup>
                           </Tooltip>
                        ))}
                     </div>
                  )}
                  <Input
                     required
                     autoFocus
                     autoComplete="off"
                     name="content"
                     variant="chat"
                     placeholder="Chat.."
                  />
                  <Tooltip>
                     <TooltipTrigger
                        render={
                           <Button
                              className="absolute right-1 bottom-1 size-[33px] rounded-full"
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
                        Send <Kbd className="ml-1">Enter</Kbd>
                     </TooltipPopup>
                  </Tooltip>
               </form>
            </div>
         </div>
      </>
   )
}
