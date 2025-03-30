import crypto from "node:crypto"
import { encodeHexLowerCase } from "@oslojs/encoding"
import { RefillingTokenBucket } from "@project/infra/rate-limit"

export const passkeyChallengeRateLimitBucket = new RefillingTokenBucket<string>(
   10,
   10,
)
const challengeBucket = new Set<string>()

export const createPasskeyChallenge = () => {
   const challenge = new Uint8Array(20)
   crypto.getRandomValues(challenge)
   const encoded = encodeHexLowerCase(challenge)
   challengeBucket.add(encoded)
   return challenge
}

export const verifyPasskeyChallenge = (challenge: Uint8Array) => {
   const encoded = encodeHexLowerCase(challenge)
   return challengeBucket.delete(encoded)
}
