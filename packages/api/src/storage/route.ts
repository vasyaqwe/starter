import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { createRouter, zValidator } from "@project/api/utils"
import { env } from "@project/env"
import { HTTPException } from "hono/http-exception"
import ky from "ky"
import { z } from "zod"

const S3 = new S3Client({
   region: "eeur",
   endpoint: `https://bfef1e994f1aac7e7a42dc4ba75197a0.r2.cloudflarestorage.com`,
   credentials: {
      accessKeyId: env.server.R2_ACCESS_KEY_ID,
      secretAccessKey: env.server.R2_SECRET_ACCESS_KEY,
   },
})

export const storageRoute = createRouter().post(
   "/upload",
   zValidator(
      "form",
      z.object({
         files: z.array(z.instanceof(File)),
      }),
   ),
   async (c) => {
      const { files } = c.req.valid("form")

      const uploded = await Promise.all(
         files.map(async (file) => {
            try {
               const url = await getSignedUrl(
                  S3,
                  new PutObjectCommand({
                     Bucket: "storage-bucket",
                     Key: file.name,
                     ContentType: file.type,
                  }),
                  { expiresIn: 30 },
               )

               await ky.put(url, {
                  body: await file.arrayBuffer(),
               })

               return { name: file.name }
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