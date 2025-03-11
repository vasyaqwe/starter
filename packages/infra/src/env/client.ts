export const env_client = {
   development: {
      STORAGE_DOMAIN: "https://pub-adc2676146514653aefef032cae1fc9d.r2.dev",
      SERVER_DOMAIN: "http://localhost:8080",
      WEB_DOMAIN: "http://localhost:3000",
   },
   production: {
      STORAGE_DOMAIN: "https://pub-adc2676146514653aefef032cae1fc9d.r2.dev",
      SERVER_DOMAIN: "https://api.project.io",
      WEB_DOMAIN: "https://app.project.io",
   },
} as const
