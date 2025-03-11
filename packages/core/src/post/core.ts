import { Api } from "@project/core/api"
import { Auth } from "@project/core/auth"
import { z } from "zod"

export const route = Api.createRouter()
   .use(Auth.middleware)
   .get(
      "/:id",
      Api.zValidator(
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
      Api.zValidator(
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
