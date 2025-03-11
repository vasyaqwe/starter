import { ApiError } from "@project/core/error"
import { Logger } from "@project/core/logger"
import type { ValidationTargets } from "hono"
import { validator } from "hono/validator"
import { ZodError, type ZodSchema, type z } from "zod"

import type { HonoEnv } from "@project/core/api/core"
import { Hono } from "hono"

export const createRouter = () => new Hono<HonoEnv>()

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
            const message = ApiError.parseZodErrorIssues(error.issues)
            Logger.error(400, message)
            return c.json(
               {
                  code: ApiError.statusToCode(400),
                  message,
               },
               400,
            )
         }

         const message =
            error instanceof Error
               ? (error.message ?? "Unknown error")
               : "Unknown error"

         Logger.error(500, message)
         return c.json(
            {
               code: ApiError.statusToCode(500),
               message,
            },
            500,
         )
      }
   })
