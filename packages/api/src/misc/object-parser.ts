// https://github.com/pilcrowonpaper/object-parser
export class ObjectParser {
   value

   constructor(value: unknown) {
      this.value = value
   }

   has(...path: string[]) {
      if (path.length < 1) {
         throw new TypeError("Invalid path")
      }

      let value = this.value

      for (let i = 0; i < path.length; i++) {
         if (typeof value !== "object" || value === null) {
            return false
         }

         const pathPart = path[i]

         if (!pathPart || !(pathPart in value)) {
            return false
         }

         value = value[pathPart as never]
      }

      return true
   }

   get(...path: string[]) {
      if (path.length < 1) {
         throw new TypeError("Invalid path")
      }

      let value = this.value

      for (let i = 0; i < path.length; i++) {
         if (typeof value !== "object" || value === null) {
            throw new Error(
               `Value in path ${path.slice(0, i + 1).join(".")} is not an object`,
            )
         }

         const pathPart = path[i]
         if (!pathPart || !(pathPart in value)) {
            throw new Error(
               `Path ${path.slice(0, i + 1).join(".")} does not exist`,
            )
         }

         value = value[pathPart as never]
      }

      return value
   }

   isString(...path: string[]) {
      return typeof this.get(...path) === "string"
   }

   getString(...path: string[]) {
      const value = this.get(...path)

      if (typeof value !== "string") {
         throw new Error(`Value in path ${path.join(".")} is not a string`)
      }

      return value
   }

   isNumber(...path: string[]) {
      return typeof this.get(...path) === "number"
   }

   getNumber(...path: string[]) {
      const value = this.get(...path)

      if (typeof value !== "number") {
         throw new Error(`Value in path ${path.join(".")} is not a string`)
      }

      return value
   }

   isBoolean(...path: string[]) {
      return typeof this.get(...path) === "boolean"
   }

   getBoolean(...path: string[]) {
      const value = this.get(...path)

      if (typeof value !== "boolean") {
         throw new Error(`Value in path ${path.join(".")} is not a boolean`)
      }

      return value
   }

   isBigInt(...path: string[]) {
      return typeof this.get(...path) === "bigint"
   }

   getBigInt(...path: string[]) {
      const value = this.get(...path)

      if (typeof value !== "bigint") {
         throw new Error(`Value in path ${path.join(".")} is not a bigint`)
      }

      return value
   }

   isObject(...path: string[]) {
      const value = this.get(...path)

      return typeof value === "object" && value !== null
   }

   getObject(...path: string[]) {
      const value = this.get(...path)

      if (typeof value !== "object" || value === null) {
         throw new Error(`Value in path ${path.join(".")} is not a object`)
      }

      return value
   }

   isArray(...path: string[]) {
      return Array.isArray(this.get(...path))
   }

   getArray(...path: string[]) {
      const value = this.get(...path)

      if (!Array.isArray(value)) {
         throw new Error(`Value in path ${path.join(".")} is not a object`)
      }

      return value
   }

   isNull(...path: string[]) {
      const value = this.get(...path)

      return value === null
   }

   isUndefined(...path: string[]) {
      const value = this.get(...path)

      return value === undefined
   }

   createParser(...path: string[]) {
      return new ObjectParser(this.getObject(...path))
   }
}
