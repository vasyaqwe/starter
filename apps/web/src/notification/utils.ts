import { isNative } from "@/ui/constants"
import { logger } from "@project/shared/logger"

export async function sendNotification({
   title,
   body,
}: { title: string; body: string }) {
   try {
      if (isNative) {
         const { sendNotification } = await import(
            "@tauri-apps/plugin-notification"
         )
         sendNotification({ title, body })
      } else if ("Notification" in window) {
         new Notification(title, { body })
      }
   } catch (error) {
      logger.error("Failed to send notification:", error)
   }
}
