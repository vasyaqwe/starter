import { useEventListener } from "@/interactions/use-event-listener"
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
   FileTriggerTooltipContent,
} from "@project/ui/components/file-trigger"
import {
   FileCard,
   FileUploader,
} from "@project/ui/components/file-uploader/index"
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
import { fileTriggerOpenAtom } from "@project/ui/store"
import { cn } from "@project/ui/utils"
import { createFileRoute } from "@tanstack/react-router"
import { useSetAtom } from "jotai"
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

   const [editingMessageId, setEditingMessageId] = React.useState<
      string | null
   >(null)

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

   const setFileTriggerOpen = useSetAtom(fileTriggerOpenAtom)
   const fileUploaderRef = React.useRef<HTMLDivElement>(null)
   useHotkeys(FILE_TRIGGER_HOTKEY, () => fileUploaderRef.current?.click(), {
      enableOnContentEditable: true,
      enableOnFormTags: true,
   })

   const [files, setFiles] = React.useState<File[]>([])

   const contentRef = React.useRef<HTMLInputElement>(null)
   const [content, setContent] = React.useState("")

   useHotkeys(
      "esc",
      () => {
         if (editingMessageId) {
            setEditingMessageId(null)
            setContent("")
         }
      },
      {
         enableOnFormTags: true,
         enableOnContentEditable: true,
      },
   )

   useEventListener("keydown", (e) => {
      if (document.activeElement?.tagName === "INPUT") return

      // Focus input if typing letter/number keys
      if (e.key.length === 1) {
         contentRef.current?.focus()
      }
   })

   return (
      <>
         <FileUploader
            value={files}
            onValueChange={setFiles}
            ref={fileUploaderRef}
            className="absolute inset-0 z-[9] h-full"
         />

         <ScrollArea
            ref={scrollAreaRef}
            className="pb-8"
         >
            <div
               data-editing={editingMessageId ? "" : undefined}
               className={
                  "group/container mx-auto w-full max-w-4xl px-3 sm:px-4"
               }
            >
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
                                 "group-data-[editing]/container:opacity-30",
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
                                          data-highlighted={
                                             editingMessageId === message.id
                                                ? ""
                                                : undefined
                                          }
                                          className={cn(
                                             "data-[highlighted]:opacity-100 group-data-[editing]/container:opacity-30",
                                          )}
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
                                                      onClick={() => {
                                                         setEditingMessageId(
                                                            message.id,
                                                         )
                                                         contentRef.current?.focus()
                                                         setContent(
                                                            message.content,
                                                         )
                                                      }}
                                                   >
                                                      <Icons.pencil />
                                                      Edit
                                                   </MenuItem>
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
                           <Button
                              onClick={() => {
                                 setFileTriggerOpen(true)
                                 fileUploaderRef.current?.click()
                              }}
                              size={"icon"}
                              variant={"ghost"}
                              className="rounded-full"
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
                  onSubmit={async (e) => {
                     e.preventDefault()

                     if (editingMessageId) {
                        setContent("")
                        return setEditingMessageId(null)
                     }

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
                     setContent("")

                     // const filesData = await Promise.all(
                     //    files.map(async (file) => {
                     //       return {
                     //          name: file.name,
                     //          type: file.type,
                     //          content: fileToBase64(file),
                     //       }
                     //    }),
                     // )
                     // await hc.storage.$post({
                     //    json: {
                     //       files: filesData,
                     //    },
                     // })

                     setFiles([])
                     scrollToBottom()
                  }}
                  className="relative flex-1"
               >
                  {files?.length ? (
                     <div className="mb-4 flex flex-wrap gap-2">
                        {files?.map((file, index) => (
                           <FileCard
                              key={index}
                              file={file}
                              onRemove={() =>
                                 setFiles((prev) =>
                                    prev.filter((_, i) => i !== index),
                                 )
                              }
                           />
                        ))}
                     </div>
                  ) : null}
                  <Input
                     ref={contentRef}
                     required
                     autoFocus
                     value={content}
                     onChange={(e) => setContent(e.target.value)}
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
                        {editingMessageId ? (
                           <Icons.check className="size-5" />
                        ) : (
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
                        )}
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
