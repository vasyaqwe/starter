export const fileToBase64 = async (file: File) => {
   const arrayBuffer = await file.arrayBuffer()
   return btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)))
}
