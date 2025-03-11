import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { api_createRouter, api_zValidator } from "@project/core/api/utils"
import { id_generate } from "@project/core/id"
import { Env } from "@project/infra/env"
import { HTTPException } from "hono/http-exception"
import ky from "ky"
import { z } from "zod"

const base64ToArrayBuffer = (base64: string) =>
   new Uint8Array(
      atob(base64)
         .split("")
         .map((char) => char.charCodeAt(0)),
   )

const S3 = new S3Client({
   region: "eeur",
   endpoint: `https://bfef1e994f1aac7e7a42dc4ba75197a0.r2.cloudflarestorage.com`,
   credentials: {
      accessKeyId: Env.R2_ACCESS_KEY_ID,
      secretAccessKey: Env.R2_SECRET_ACCESS_KEY,
   },
})

export const storage_route = api_createRouter().post(
   "/",
   api_zValidator(
      "json",
      z.object({
         files: z.array(
            z.object({
               name: z.string(),
               type: z.string(),
               content: z.string(),
            }),
         ),
      }),
   ),
   async (c) => {
      const { files } = c.req.valid("json")

      const uploded = await Promise.all(
         files.map(async (file) => {
            try {
               const PATH = "files/"

               const url = await getSignedUrl(
                  S3,
                  new PutObjectCommand({
                     Bucket: "storage-bucket",
                     Key: `${PATH}${id_generate("file")}`,
                     ContentType: file.type,
                  }),
                  { expiresIn: 30 },
               )

               await ky.put(url, {
                  body: base64ToArrayBuffer(file.content),
               })

               return {
                  name: file.name,
                  url: `${c.var.env.STORAGE_DOMAIN}/${PATH}${file.name}`,
               }
            } catch (err) {
               return {
                  name: file.name,
                  error: err instanceof Error ? err.message : "Unknown error",
               }
            }
         }),
      )

      if (uploded.every((r) => r.error))
         throw new HTTPException(400, {
            message: "All files failed to upload",
         })

      return c.json({ status: "ok", uploded })
   },
)
