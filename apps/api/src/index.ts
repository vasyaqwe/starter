import { Api } from "@project/core/api"
import { Logger } from "@project/core/logger"

const server = Bun.serve({
   port: 8080,
   hostname: "0.0.0.0",
   fetch: Api.routes.fetch,
})

Logger.info("server running", server.port)
