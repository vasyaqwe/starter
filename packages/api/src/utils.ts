import { Hono, type ValidationTargets } from "hono"
import { validator } from "hono/validator"
import { ZodError, type ZodSchema, type z } from "zod"
import type { AppContext } from "./context"
import { parseZodErrorIssues } from "./error/utils"

export const createRouter = () => new Hono<AppContext>()

export const appendSearchParams = (
   url: string,
   params: Record<string, string>,
) => {
   const urlObj = new URL(url)
   // biome-ignore lint/complexity/noForEach: <explanation>
   Object.entries(params).forEach(([key, value]) => {
      urlObj.searchParams.append(key, value)
   })
   return urlObj.toString()
}

export const zValidator = <
   T extends ZodSchema,
   Target extends keyof ValidationTargets,
>(
   target: Target,
   schema: T,
) =>
   validator(target, async (value, c) => {
      try {
         return (await schema.parseAsync(value)) as z.infer<T>
      } catch (error) {
         if (error instanceof ZodError) {
            return c.json(
               {
                  code: "BAD_REQUEST",
                  message: parseZodErrorIssues(error.issues),
               },
               400,
            )
         }

         return c.json(
            {
               code: "INTERNAL_SERVER_ERROR",
               message:
                  error instanceof Error
                     ? (error.message ?? "Unknown error")
                     : "Unknown error",
            },
            500,
         )
      }
   })
