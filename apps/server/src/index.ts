import app from "@project/api"
import { logger } from "@project/shared/logger"

const server = Bun.serve({
   port: 8080,
   hostname: "0.0.0.0",
   fetch: app.fetch,
})

logger.info("server running", server.port)
