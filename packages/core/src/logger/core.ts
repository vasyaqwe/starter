// courtesy of https://github.com/nekochan0122
import c from "ansi-colors"

type Method = "info" | "warn" | "error" | "success" | "loading"

const DISABLE_IN_PRODUCTION = false

const NAME = c.cyan.bold(` [LOG] `)

const prefixes: Record<Method, string> = {
   info: c.white("[INFO]"),
   warn: c.yellow("[WARN]"),
   error: c.red("[ERROR]"),
   success: c.green("[SUCCESS]"),
   loading: c.magenta("[LOADING]"),
}

const methods: Record<Method, "log" | "error"> = {
   info: "log",
   warn: "error",
   error: "error",
   success: "log",
   loading: "log",
}

const loggerFactory = (method: Method) => {
   return (...message: unknown[]) => {
      if (DISABLE_IN_PRODUCTION && process.env.NODE_ENV === "production") return

      const consoleLogger = console[methods[method]]
      const prefix = `${NAME}${prefixes[method]}`

      consoleLogger(prefix, ...message)
   }
}

export const info = loggerFactory("info")
export const warn = loggerFactory("warn")
export const error = loggerFactory("error")
export const success = loggerFactory("success")
export const loading = loggerFactory("loading")
