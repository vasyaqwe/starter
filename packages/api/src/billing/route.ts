import { WebhookVerificationError, validateEvent } from "@polar-sh/sdk/webhooks"
import { statusToCode } from "@project/api/error/utils"
import { createRouter } from "@project/api/utils"
import { eq } from "@project/db"
import { subscription } from "@project/db/schema/subscription"
import { env } from "@project/env"
import { HTTPException } from "hono/http-exception"

export const billingRoute = createRouter()
   .get("/checkout", async (c) => {
      const checkout = await c.get("payment").checkouts.custom.create({
         productPriceId: "27c4d41f-107d-451b-835b-3bcff660c630",
         customerEmail: c.get("user").email,
         customerName: c.get("user").name,
         metadata: {
            userId: c.get("user").id,
         },
      })
      return c.redirect(checkout.url)
   })
   .post("/webhook", async (c) => {
      try {
         const rawBody = await c.req.raw.text()
         const event = validateEvent(
            rawBody,
            Object.fromEntries(c.req.raw.headers),
            env.server.POLAR_WEBHOOK_SECRET,
         )

         if (event.type === "subscription.created") {
            await c
               .get("db")
               .insert(subscription)
               .values({
                  userId: c.get("user").id,
                  status: event.data.status,
                  customerId: event.data.customerId,
                  priceId: event.data.priceId,
                  productId: event.data.productId,
                  currentPeriodStart: event.data.currentPeriodStart,
                  currentPeriodEnd: event.data.currentPeriodEnd,
               })

            return c.json({ status: "ok", message: "subscription created" })
         }

         if (event.type === "subscription.active") {
            await c
               .get("db")
               .update(subscription)
               .set({
                  status: "active",
               })
               .where(eq(subscription.customerId, event.data.customerId))

            return c.json({ status: "ok", message: "subscription made active" })
         }

         if (event.type === "subscription.updated") {
            await c
               .get("db")
               .update(subscription)
               .set({
                  status: event.data.status,
                  currentPeriodStart: event.data.currentPeriodStart,
                  currentPeriodEnd: event.data.currentPeriodEnd,
               })
               .where(eq(subscription.customerId, event.data.customerId))

            return c.json({ status: "ok", message: "subscription updated" })
         }

         if (event.type === "subscription.canceled") {
            await c
               .get("db")
               .update(subscription)
               .set({ status: "canceled" })
               .where(eq(subscription.customerId, event.data.customerId))
            return c.json({ status: "ok", message: "subscription canceled" })
         }

         return c.json({ status: "ok", message: "no event match" })
      } catch (error) {
         if (error instanceof WebhookVerificationError) {
            c.json(
               {
                  code: statusToCode(403),
                  message: error.message,
               },
               403,
            )
         }

         throw new HTTPException(500, {
            message: "Internal server error",
         })
      }
   })
