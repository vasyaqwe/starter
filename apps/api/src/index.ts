import { routes } from "@project/core/api"
import { logger } from "@project/infra/logger"

const server = Bun.serve({
   port: 8080,
   hostname: "0.0.0.0",
   fetch: routes.fetch,
})

logger.info("server running", server.port)
