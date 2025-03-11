import type { HonoEnv } from "@project/core/api/types"
import { ApiError } from "@project/core/error"
import { logger } from "@project/infra/logger"
import type { ValidationTargets } from "hono"
import { Hono } from "hono"
import { validator } from "hono/validator"
import { ZodError, type ZodSchema, type z } from "zod"

export const api_createRouter = () => new Hono<HonoEnv>()

export const api_zValidator = <
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
            logger.error(400, message)
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

         logger.error(500, message)
         return c.json(
            {
               code: ApiError.statusToCode(500),
               message,
            },
            500,
         )
      }
   })
