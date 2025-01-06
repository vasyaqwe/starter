import { userMeQuery } from "@/user/queries"
import { useSuspenseQuery } from "@tanstack/react-query"

export function useAuth() {
   const user = useSuspenseQuery(userMeQuery())

   return {
      user: user.data,
   }
}
