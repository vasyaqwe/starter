export const clientEnv = {
   development: {
      STORAGE_URL: "https://pub-adc2676146514653aefef032cae1fc9d.r2.dev",
      API_URL: "http://localhost:8080",
      WEB_URL: "http://localhost:3000",
   },
   production: {
      STORAGE_URL: "https://pub-adc2676146514653aefef032cae1fc9d.r2.dev",
      API_URL: "https://api.project.io",
      WEB_URL: "https://app.project.io",
   },
} as const
