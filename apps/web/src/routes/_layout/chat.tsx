import { formatDate } from "@/date"
import { useEventListener } from "@/interactions/use-event-listener"
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
import { atom, useAtom, useSetAtom } from "jotai"
import * as React from "react"
import { useHotkeys } from "react-hotkeys-hook"
import * as R from "remeda"
import { toast } from "sonner"

export const Route = createFileRoute("/_layout/chat")({
   component: RouteComponent,
   head: () => ({
      meta: [{ title: "Chat" }],
   }),
})

const scroll = (node: HTMLElement | null) => node?.scrollIntoView()

const editingMessageIdAtom = atom<string | null>(null)
const contentAtom = atom("")

const fakeMessages = [
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
].map((m) => ({ ...m, id: crypto.randomUUID() }))

function RouteComponent() {
   const [messages, setMessages] = React.useState(fakeMessages)

   const groupedMessages = R.groupBy(messages, (m) => formatDate(m.createdAt))

   const [editingMessageId, setEditingMessageId] = useAtom(editingMessageIdAtom)

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
   const [content, setContent] = useAtom(contentAtom)

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
      if (e.key.length === 1) contentRef.current?.focus()
   })

   const currentUserId = "1"

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
               {Object.entries(groupedMessages).map(([date, messages]) => (
                  <div key={date}>
                     <MessageGroupDate>{date}</MessageGroupDate>{" "}
                     <div className="mt-4 w-full">
                        {messages.map((message, idx) => {
                           const isFirstInSenderGroup =
                              idx === 0 ||
                              messages[idx - 1]?.sender?.id !==
                                 message.sender?.id

                           const isLastInSenderGroup =
                              idx === messages.length - 1 ||
                              messages[idx + 1]?.sender?.id !==
                                 message.sender?.id

                           const prevMessage = messages[idx - 1]
                           const isFirstMessageInAWhile =
                              !prevMessage ||
                              new Date(message.createdAt).getTime() -
                                 new Date(prevMessage.createdAt).getTime() >
                                 10 * 60 * 1000 // 10 min

                           return (
                              <div
                                 className="flex flex-col"
                                 key={message.id}
                              >
                                 {isFirstMessageInAWhile && (
                                    <span className="mx-auto mb-3 block w-fit text-foreground/70 text-xs">
                                       {formatDate(
                                          new Date(message.createdAt),
                                          { timeStyle: "short" },
                                       )}
                                    </span>
                                 )}
                                 <MessageComponent
                                    message={message}
                                    isMine={
                                       currentUserId === message.sender?.id
                                    }
                                    isLastInSenderGroup={isLastInSenderGroup}
                                    isFirstInSenderGroup={isFirstInSenderGroup}
                                 />
                              </div>
                           )
                        })}
                     </div>
                  </div>
               ))}
            </div>
            <div ref={scroll} />
         </ScrollArea>
         <div className="border-neutral border-t bg-background">
            <div className="mx-auto flex max-w-4xl items-end gap-1 p-2 md:gap-2 md:p-4">
               <div className="flex items-center gap-0.5 md:mb-0.5">
                  <Tooltip>
                     <TooltipTrigger
                        render={
                           <Button
                              onClick={() => {
                                 setFileTriggerOpen(true)
                                 fileUploaderRef.current?.click()
                              }}
                              kind={"icon"}
                              variant={"ghost"}
                              shape={"circle"}
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
                                       shape={"circle"}
                                       kind={"icon"}
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
                        ].map((emoji, idx) => (
                           <Button
                              key={idx}
                              variant={"menu-item"}
                              size={"sm"}
                              kind={"icon"}
                              shape={"circle"}
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
                  className="relative grow"
               >
                  {files?.length ? (
                     <div className="mb-4 flex flex-wrap gap-2">
                        {files?.map((file, idx) => (
                           <FileCard
                              key={idx}
                              file={file}
                              onRemove={() =>
                                 setFiles((prev) =>
                                    prev.filter((_, i) => i !== idx),
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
                              size={"sm"}
                              kind={"icon"}
                              shape={"circle"}
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

function MessageComponent({
   message,
   isMine,
   isLastInSenderGroup,
   isFirstInSenderGroup,
}: {
   message: (typeof fakeMessages)[number]
   isMine: boolean
   isLastInSenderGroup: boolean
   isFirstInSenderGroup: boolean
}) {
   const [editingMessageId, setEditingMessageId] = useAtom(editingMessageIdAtom)
   const setContent = useSetAtom(contentAtom)
   const currentUserId = "1"

   const state =
      isFirstInSenderGroup && isLastInSenderGroup
         ? "single"
         : isFirstInSenderGroup
           ? "first"
           : isLastInSenderGroup
             ? "last"
             : "middle"

   return (
      <MessageGroup isMine={isMine}>
         {currentUserId === message.sender.id ? null : (
            <UserAvatar
               className={cn(
                  "group-data-[editing]/container:opacity-30",
                  "mt-auto mb-[3px]",
                  isLastInSenderGroup ? "" : "invisible",
               )}
               user={message.sender}
            >
               <OnlineIndicator
                  className={cn(isLastInSenderGroup ? "" : "hidden")}
               />
            </UserAvatar>
         )}
         <Message
            isMine={isMine}
            data-highlighted={editingMessageId === message.id ? "" : undefined}
            className={cn(
               "data-[highlighted]:opacity-100 group-data-[editing]/container:opacity-30",
               state === "first" || state === "single" ? "mt-4" : "",
            )}
         >
            <MessageActions>
               <Menu>
                  <MenuTrigger
                     className={cn(
                        buttonVariants({
                           variant: "ghost",
                           size: "sm",
                           kind: "icon",
                           shape: "circle",
                        }),
                     )}
                  >
                     <Icons.ellipsisHorizontal className="size-[22px]" />
                  </MenuTrigger>
                  <MenuPopup align={isMine ? "end" : "start"}>
                     <MenuItem
                        onClick={() => {
                           setEditingMessageId(message.id)
                           setContent(message.content)
                           // contentRef.current?.focus()
                        }}
                     >
                        <Icons.pencil />
                        Edit
                     </MenuItem>
                     <MenuItem
                        destructive
                        onClick={() => toast("deleted message (fake)")}
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
                        className="hyphens-auto"
                        isMine={isMine}
                        state={state}
                     >
                        {message.content}
                     </MessageContent>
                  }
               />
               <TooltipPopup align={isMine ? "end" : "start"}>
                  {formatDate(message.createdAt, {
                     dateStyle: "medium",
                     timeStyle: "short",
                  })}
               </TooltipPopup>
            </Tooltip>
         </Message>
      </MessageGroup>
   )
}
