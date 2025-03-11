import { EmailHtml } from "@project/core/email-html"

export const loginOtpEmail = (code: string) =>
   EmailHtml.body({
      title: "Project one-time password",
      preheader: "Use this code to log in to Project",
      children: `
            <h1 style="font-size: 20px; color: #141414; margin-bottom: 24px;">
               Enter this code to log in to Project
            </h1>
            <p style="font-size: 34px; font-family: monospace; margin-top: 0px; margin-bottom: 32px; font-weight: 900; width: fit-content; letter-spacing: 6px; background-color:#141414; padding: 6px 16px 6px 16px; border-radius: 16px; color: #e5e5e5;">
               ${code}
            </p>
            <p style="font-size: 15px;">
               The code will expire in 5 minutes.
            </p>  
`,
   })
