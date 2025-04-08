import { WebhookVerificationError, validateEvent } from "@polar-sh/sdk/webhooks"
import { statusToCode } from "@project/core/api/error"
import { createRouter } from "@project/core/api/utils"
import { authMiddleware } from "@project/core/auth/middleware"
import { subscription } from "@project/core/billing/schema"
import { and, eq } from "drizzle-orm"
import { HTTPException } from "hono/http-exception"

export const billingRouter = createRouter()
   .get("/checkout", authMiddleware, async (c) => {
      const checkout = await c.var.payment.checkouts.custom.create({
         productPriceId: "c07ab064-b153-4f04-83f5-185ed4e5a43b",
         customerEmail: c.var.user.email,
         customerName: c.var.user.name,
         metadata: {
            userId: c.var.user.id,
         },
      })
      return c.redirect(checkout.url)
   })
   .post("/cancel", authMiddleware, async (c) => {
      const foundSubscription = await c.var.db.query.subscription.findFirst({
         where: and(
            eq(subscription.userId, c.var.user.id),
            eq(subscription.status, "active"),
            eq(subscription.cancelAtPeriodEnd, false),
         ),
      })

      if (!foundSubscription)
         throw new HTTPException(400, {
            message: "No active subscription found",
         })

      await c.var.db.transaction(async (tx) => {
         await c.var.payment.customerPortal.subscriptions.cancel({
            id: foundSubscription.id,
         })
         await tx
            .update(subscription)
            .set({ cancelAtPeriodEnd: true })
            .where(eq(subscription.id, foundSubscription.id))
      })

      return c.json({
         status: "ok",
         message: "subscription scheduled for cancellation",
      })
   })
   .post("/webhook", async (c) => {
      try {
         const rawBody = await c.req.raw.text()
         const event = validateEvent(
            rawBody,
            Object.fromEntries(c.req.raw.headers),
            c.var.env.POLAR_WEBHOOK_SECRET,
         )

         if (event.type === "subscription.created") {
            const userId = event.data.metadata.userId
            if (!userId || typeof userId !== "string")
               throw new HTTPException(400, {
                  message: "userId missing in metadata",
               })

            await c.var.db
               .insert(subscription)
               .values({
                  id: event.data.id,
                  userId,
                  status: event.data.status,
                  customerId: event.data.customerId,
                  priceId: event.data.priceId,
                  productId: event.data.productId,
                  currentPeriodStart: event.data.currentPeriodStart,
                  currentPeriodEnd: event.data.currentPeriodEnd,
               })
               .onConflictDoUpdate({
                  set: {
                     id: event.data.id,
                     status: event.data.status,
                     priceId: event.data.priceId,
                     productId: event.data.productId,
                     currentPeriodStart: event.data.currentPeriodStart,
                     currentPeriodEnd: event.data.currentPeriodEnd,
                     cancelAtPeriodEnd: false,
                  },
                  target: [subscription.userId, subscription.productId],
               })

            return c.json({ status: "ok", message: "subscription created" })
         }

         if (event.type === "subscription.updated") {
            await c.var.db
               .update(subscription)
               .set({
                  status: event.data.status,
                  currentPeriodStart: event.data.currentPeriodStart,
                  currentPeriodEnd: event.data.currentPeriodEnd,
               })
               .where(eq(subscription.customerId, event.data.customerId))

            return c.json({ status: "ok", message: "subscription updated" })
         }

         // if (event.type === "subscription.canceled") {
         //    await c
         //       .get("db")
         //       .update(subscription)
         //       .set({ cancelAtPeriodEnd: true })
         //       .where(eq(subscription.customerId, event.data.customerId))

         //    return c.json({
         //       status: "ok",
         //       message: "subscription scheduled for cancellation",
         //    })
         // }

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
            message:
               error instanceof Error ? error.message : "Internal server error",
         })
      }
   })
