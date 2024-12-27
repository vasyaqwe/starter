import type * as React from "react"

type IconProps = React.ComponentProps<"svg">

export const Icons = {
   home: (props: IconProps) => (
      <svg
         xmlns="http://www.w3.org/2000/svg"
         viewBox="0 0 20 20"
         {...props}
      >
         <g fill="currentColor">
            <polyline
               points="2.5 7.5 10 2.5 17.5 7.5"
               fill="none"
               stroke="currentColor"
               strokeLinecap="round"
               strokeLinejoin="round"
               strokeWidth="1.75"
            />
            <path
               d="m16,10v4c0,1.657-1.343,3-3,3h-6c-1.657,0-3-1.343-3-3v-4"
               fill="none"
               stroke="currentColor"
               strokeLinecap="round"
               strokeLinejoin="round"
               strokeWidth="1.75"
            />
            <line
               x1="10"
               y1="17"
               x2="10"
               y2="13"
               fill="none"
               stroke="currentColor"
               strokeLinecap="round"
               strokeLinejoin="round"
               strokeWidth="1.75"
            />
         </g>
      </svg>
   ),
}
