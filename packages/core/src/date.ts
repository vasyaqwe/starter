export type TimeSpanUnit = "ms" | "s" | "m" | "h" | "d" | "w"

export class TimeSpan {
   constructor(value: number, unit: TimeSpanUnit) {
      this.value = value
      this.unit = unit
   }

   public value: number
   public unit: TimeSpanUnit

   public milliseconds(): number {
      if (this.unit === "ms") {
         return this.value
      }
      if (this.unit === "s") {
         return this.value * 1000
      }
      if (this.unit === "m") {
         return this.value * 1000 * 60
      }
      if (this.unit === "h") {
         return this.value * 1000 * 60 * 60
      }
      if (this.unit === "d") {
         return this.value * 1000 * 60 * 60 * 24
      }
      return this.value * 1000 * 60 * 60 * 24 * 7
   }

   public seconds(): number {
      return this.milliseconds() / 1000
   }

   public transform(x: number): TimeSpan {
      return new TimeSpan(Math.round(this.milliseconds() * x), "ms")
   }
}

export const isWithinExpiration = (date: Date) => {
   return Date.now() < date.getTime()
}

export const createDate = (timeSpan: TimeSpan) => {
   return new Date(Date.now() + timeSpan.milliseconds())
}

export type TypedArray =
   | Uint8Array
   | Int8Array
   | Uint16Array
   | Int16Array
   | Uint32Array
   | Int32Array
   | Float32Array
   | Float64Array
   | BigInt64Array
   | BigUint64Array
