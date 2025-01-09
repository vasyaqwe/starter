export const base64ToArrayBuffer = (base64: string) =>
   new Uint8Array(
      atob(base64)
         .split("")
         .map((char) => char.charCodeAt(0)),
   )
