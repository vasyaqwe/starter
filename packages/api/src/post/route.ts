import { createRouter, zValidator } from "@project/api/misc/utils"
import { authMiddleware } from "@project/api/user/auth/middleware"
import { z } from "zod"

export const postRoute = createRouter()
   .use(authMiddleware)
   .get(
      "/:id",
      zValidator(
         "param",
         z.object({
            id: z.string(),
         }),
      ),
      (c) => {
         const data = c.req.valid("param")
         return c.json({
            message: data,
         })
      },
   )
   .post(
      "/",
      zValidator(
         "json",
         z.object({
            someData: z.string(),
         }),
      ),
      (c) => {
         const data = c.req.valid("json")
         return c.json({
            message: data,
         })
      },
   )
