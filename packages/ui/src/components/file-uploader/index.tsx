import { getCurrentWebview } from "@tauri-apps/api/webview"
import { exists, readFile } from "@tauri-apps/plugin-fs"
//courtesy of https://github.com/sadmann7
import * as React from "react"
import Dropzone, {
   type DropzoneProps,
   type FileRejection,
} from "react-dropzone"
import { toast } from "sonner"
import { isNative } from "../../constants"
import { cn } from "../../utils"
import { Button } from "../button"
import { Icons } from "../icons"
import { Tooltip, TooltipPopup, TooltipTrigger } from "../tooltip"
import { useControllableState } from "./hooks/use-controllable-state"
import { useDragState } from "./hooks/use-drag-state"
import { formatBytes } from "./utils"

type NativeDropFile = {
   path: string
   contents: Uint8Array<ArrayBufferLike>
}

export type NativeDragDropEvent =
   | {
        type: "drag"
        x: number
        y: number
     }
   | {
        type: "drop"
        files: NativeDropFile[]
     }
   | {
        type: "cancel"
     }

type FileUploaderProps = React.ComponentProps<"div"> & {
   /**
    * Value of the uploader.
    * @type File[]
    * @default undefined
    * @example value={files}
    */
   value?: File[]

   /**
    * Function to be called when the value changes.
    * @type (files: File[]) => void
    * @default undefined
    * @example onValueChange={(files) => setFiles(files)}
    */
   onValueChange?: (files: File[]) => void

   /**
    * Function to be called when files are uploaded.
    * @type (files: File[]) => Promise<void>
    * @default undefined
    * @example onUpload={(files) => uploadFiles(files)}
    */
   onUpload?: (files: File[]) => Promise<void>

   /**
    * Progress of the uploaded files.
    * @type Record<string, number> | undefined
    * @default undefined
    * @example progresses={{ "file1.png": 50 }}
    */
   progresses?: Record<string, number>

   /**
    * Accepted file types for the uploader.
    * @type { [key: string]: string[]}
    * @default
    * ```ts
    * { "image/*": [] }
    * ```
    * @example accept={["image/png", "image/jpeg"]}
    */
   accept?: DropzoneProps["accept"]

   /**
    * Maximum file size for the uploader.
    * @type number | undefined
    * @default 1024 * 1024 * 2 // 2MB
    * @example maxSize={1024 * 1024 * 2} // 2MB
    */
   maxSize?: DropzoneProps["maxSize"]

   /**
    * Maximum number of files for the uploader.
    * @type number | undefined
    * @default 1
    * @example maxFileCount={4}
    */
   maxFileCount?: DropzoneProps["maxFiles"]

   /**
    * Whether the uploader should accept multiple files.
    * @type boolean
    * @default false
    * @example multiple
    */
   multiple?: boolean

   /**
    * Whether the uploader is disabled.
    * @type boolean
    * @default false
    * @example disabled
    */
   disabled?: boolean
}

export function FileUploader(props: FileUploaderProps) {
   const {
      value: valueProp,
      onValueChange,
      onUpload,
      progresses,
      maxSize = 1024 * 1024 * 5, // 5 mb
      maxFileCount = Infinity,
      multiple = false,
      disabled = false,
      className,
      ...dropzoneProps
   } = props

   const [files, setFiles] = useControllableState({
      prop: valueProp,
      onChange: onValueChange,
   })

   const truncate = (str: string, maxLength: number) => {
      if (str.length <= maxLength) return str

      const ext = str.match(/\.(png|jpeg|jpg)$/i)
      if (!ext) return `${str.slice(0, maxLength - 1)}…`

      const nameLength = maxLength - ext[0].length - 3
      return `${str.slice(0, nameLength)}...${ext[0]}`
   }

   const onDrop = (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      if (!multiple && maxFileCount === 1 && acceptedFiles.length > 1) {
         toast.error("Cannot upload more than 1 file at a time")
         return
      }

      if ((files?.length ?? 0) + acceptedFiles.length > maxFileCount) {
         toast.error(`Cannot upload more than ${maxFileCount} files`)
         return
      }

      const newFiles = acceptedFiles.map((file) =>
         Object.assign(file, {
            preview: URL.createObjectURL(file),
         }),
      )

      const updatedFiles = files ? [...files, ...newFiles] : newFiles

      setFiles(updatedFiles)

      if (rejectedFiles.length > 0) {
         for (const [index, { file }] of rejectedFiles.entries()) {
            if (
               rejectedFiles[index]?.errors.some(
                  (e) => e.code === "file-too-large",
               )
            ) {
               return toast.error(
                  `File ${truncate(file.name, 23)} is too large`,
               )
            }
            toast.error(`Couldn't upload ${truncate(file.name, 23)}`)
         }
      }

      if (
         onUpload &&
         updatedFiles.length > 0 &&
         updatedFiles.length <= maxFileCount
      ) {
         // const target =
         //    updatedFiles.length > 0 ? `${updatedFiles.length} files` : `file`
         // toast.promise(onUpload(updatedFiles), {
         //    loading: `Uploading ${target}...`,
         //    success: () => {
         //       setFiles([])
         //       return `${target} uploaded`
         //    },
         //    error: `Failed to upload ${target}`,
         // })
      }
   }

   // Revoke preview url when component unmounts
   React.useEffect(() => {
      return () => {
         if (!files) return
         for (const file of files) {
            if (isFileWithPreview(file)) {
               URL.revokeObjectURL(file.preview)
            }
         }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [])

   const isDisabled = disabled || (files?.length ?? 0) >= maxFileCount

   React.useEffect(() => {
      if (!isNative) return

      let unlisten: (() => void) | null = null

      getCurrentWebview()
         .onDragDropEvent(async (event) => {
            if (event.payload.type === "drop") {
               const paths = event.payload.paths

               const files = await Promise.all(
                  paths.flatMap(async (path) => {
                     if (await exists(path)) {
                        const contents = await readFile(path)
                        return { path, contents } satisfies NativeDropFile
                     }
                     return null
                  }),
               )

               const acceptedFiles = []
               const rejectedFiles = []

               for (const file of files.filter(Boolean)) {
                  const path = file?.path
                  const contents = file?.contents

                  const fileName = path?.split("/").pop() || "unknown"

                  // Example validation rules
                  const fileTooLarge = (contents?.length ?? 0) > maxSize // replace with your limit

                  if (fileTooLarge) {
                     rejectedFiles.push({
                        file: { path, name: fileName },
                        errors: [
                           ...(fileTooLarge
                              ? [{ code: "file-too-large" }]
                              : []),
                        ],
                     })
                  } else {
                     acceptedFiles.push({ path, contents, name: fileName })
                  }
               }

               const newFiles = acceptedFiles
                  .filter((file) => file.contents)
                  .map((file) => {
                     // biome-ignore lint/style/noNonNullAssertion: <explanation>
                     const blob = new Blob([file.contents!])
                     return new File([blob], file.name || "unknown")
                  })

               setFiles((prev) => (prev ? [...prev, ...newFiles] : newFiles))

               if (rejectedFiles.length > 0) {
                  for (const { file, errors } of rejectedFiles) {
                     if (errors.some((e) => e.code === "file-too-large")) {
                        toast.error(
                           `File ${truncate(file.name, 23)} is too large`,
                        )
                     } else {
                        toast.error(
                           `Couldn't upload ${truncate(file.name, 23)}`,
                        )
                     }
                  }
               }
            }
         })
         .then((disposer) => {
            unlisten = disposer
         })

      return () => {
         unlisten?.()
      }
   }, [isNative, maxSize])

   const { isDragging } = useDragState()

   return (
      <Dropzone
         onDrop={onDrop}
         maxSize={maxSize}
         maxFiles={maxFileCount}
         multiple={maxFileCount > 1 || multiple}
         disabled={isDisabled}
      >
         {({ getRootProps, getInputProps }) => (
            <div
               {...getRootProps()}
               className={cn(
                  "bg-black/10",
                  isDragging ? "" : "invisible",
                  isDisabled ? "pointer-events-none opacity-70" : "",
                  className,
               )}
               {...dropzoneProps}
            >
               <input {...getInputProps()} />
               {/* <div className="flex flex-col items-center justify-center gap-4 sm:px-5">
                  <div className="flex flex-col gap-2">
                     <p className="font-medium text-muted-foreground">
                        Drag {`'n'`} drop files here
                     </p>
                     <p className="text-muted-foreground/70 text-sm">
                           You can upload
                           {maxFileCount > 1
                              ? ` ${maxFileCount === Infinity ? "multiple" : maxFileCount}
                      files (up to ${formatBytes(maxSize)} each)`
                              : ` a file with size up to ${formatBytes(maxSize)}`}
                        </p>
                  </div>
               </div> */}
            </div>
         )}
      </Dropzone>
   )
}

export function FileCard({
   file,
   onRemove,
}: {
   file: File
   onRemove: () => void
}) {
   return (
      <Tooltip delay={0}>
         <TooltipTrigger
            render={
               <div className="group relative flex size-20 flex-col items-center justify-center rounded-xl border border-neutral dark:bg-primary-3" />
            }
         >
            <Button
               onClick={onRemove}
               type="button"
               kind={"icon"}
               size={"xs"}
               aria-label={`Remove ${file.name}`}
               className="-top-2 -left-2 invisible absolute rounded-full border-neutral bg-white p-1 text-foreground shadow-none hover:border-red-9 hover:bg-red-9 hover:text-white group-hover:visible dark:border-transparent dark:bg-primary-7 dark:shadow-xs dark:hover:border-red-9 dark:hover:bg-red-9"
            >
               <Icons.xMark className="size-4" />
            </Button>
            <FilePreview file={file} />
            {!file.type.startsWith("image/") ? (
               <span className="mt-1 font-semibold text-foreground/75 text-xs">
                  {formatBytes(file.size)}
               </span>
            ) : null}
         </TooltipTrigger>
         <TooltipPopup sideOffset={13}>{file.name}</TooltipPopup>
      </Tooltip>
   )
}

const isFileWithPreview = (file: File): file is File & { preview: string } =>
   "preview" in file && typeof file.preview === "string"

function FilePreview({
   file,
}: {
   file: File & { preview?: string }
}) {
   if (file.type.startsWith("image/")) {
      return (
         <img
            src={file.preview}
            alt={file.name}
            width={56}
            height={56}
            loading="lazy"
            className="size-full shrink-0 rounded-[inherit] object-cover object-top"
         />
      )
   }

   return (
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
   )
}
