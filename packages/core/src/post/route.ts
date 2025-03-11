import { api_createRouter, api_zValidator } from "@project/core/api/utils"
import { auth_middleware } from "@project/core/auth/middleware"
import { z } from "zod"

export const post_route = api_createRouter()
   .use(auth_middleware)
   .get(
      "/:id",
      api_zValidator(
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
      api_zValidator(
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
