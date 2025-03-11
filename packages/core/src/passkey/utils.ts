import { encodeHexLowerCase } from "@oslojs/encoding"
import { RateLimit } from "@project/core/rate-limit"

export const challengeRateLimitBucket =
   new RateLimit.RefillingTokenBucket<string>(10, 10)
const challengeBucket = new Set<string>()

export const createChallenge = () => {
   const challenge = new Uint8Array(20)
   crypto.getRandomValues(challenge)
   const encoded = encodeHexLowerCase(challenge)
   challengeBucket.add(encoded)
   return challenge
}
export const verifyChallenge = (challenge: Uint8Array) => {
   const encoded = encodeHexLowerCase(challenge)
   return challengeBucket.delete(encoded)
}
