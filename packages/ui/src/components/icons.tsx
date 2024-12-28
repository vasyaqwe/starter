import type * as React from "react"

type IconProps = React.ComponentProps<"svg">

export const Icons = {
   home: (props: IconProps) => (
      <svg
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
   homeSolid: (props: IconProps) => (
      <svg
         viewBox="0 0 20 20"
         {...props}
      >
         <g fill="currentColor">
            <path
               d="m10,6.105l-7,4.648v3.246c0,2.206,1.794,4,4,4h2v-3c0-.552.447-1,1-1s1,.448,1,1v3h2c2.206,0,4-1.794,4-4v-3.217l-7-4.678Z"
               strokeWidth="0"
               fill="currentColor"
            />
            <path
               d="m17.499,8.5c-.19,0-.383-.054-.554-.168l-6.945-4.63-6.945,4.63c-.462.307-1.082.182-1.387-.277-.307-.459-.183-1.081.277-1.387L9.445,1.668c.336-.224.773-.224,1.109,0l7.5,5c.46.306.584.927.277,1.387-.192.289-.51.445-.833.445Z"
               fill="currentColor"
               strokeWidth="0"
            />
         </g>
      </svg>
   ),
   chat: (props: IconProps) => (
      <svg
         viewBox="0 0 20 20"
         {...props}
      >
         <g fill="currentColor">
            <path
               d="m10,3c-3.866,0-7,3.134-7,7,0,1.376.403,2.655,1.088,3.737l-1.088,3.263,3.263-1.088c1.082.685,2.361,1.088,3.737,1.088,3.866,0,7-3.134,7-7s-3.134-7-7-7Z"
               fill="none"
               stroke="currentColor"
               strokeLinecap="round"
               strokeLinejoin="round"
               strokeWidth="1.75"
            />
         </g>
      </svg>
   ),
   chatSolid: (props: IconProps) => (
      <svg
         viewBox="0 0 20 20"
         {...props}
      >
         <g fill="currentColor">
            <path
               d="m10,2C5.589,2,2,5.589,2,10c0,1.44.388,2.789,1.057,3.958l-1.018,3.055c-.09.27-.02.567.181.768.143.143.334.22.53.22.08,0,.16-.013.237-.039l3.055-1.018c1.169.669,2.518,1.057,3.958,1.057,4.411,0,8-3.589,8-8S14.411,2,10,2Z"
               strokeWidth="0"
               fill="currentColor"
            />
         </g>
      </svg>
   ),
   paperClip: (props: IconProps) => (
      <svg
         viewBox="0 0 20 20"
         {...props}
      >
         <g fill="currentColor">
            <path
               d="m8,7v4c0,1.105.895,2,2,2h0c1.105,0,2-.895,2-2v-4c0-2.209-1.791-4-4-4h0c-2.209,0-4,1.791-4,4v4c0,3.314,2.686,6,6,6h0c3.314,0,6-2.686,6-6v-4"
               fill="none"
               stroke="currentColor"
               strokeLinecap="round"
               strokeLinejoin="round"
               strokeWidth="1.75"
            />
         </g>
      </svg>
   ),
   facePlus: (props: IconProps) => (
      <svg
         viewBox="0 0 20 20"
         {...props}
      >
         <g fill="currentColor">
            <circle
               cx="6.75"
               cy="10.25"
               r="1.25"
               strokeWidth="0"
               fill="currentColor"
            />
            <circle
               cx="13.25"
               cy="10.25"
               r="1.25"
               strokeWidth="0"
               fill="currentColor"
            />
            <path
               d="m8.667,12h2.667c.368,0,.667.299.667.667h0c0,1.104-.896,2-2,2h0c-1.104,0-2-.896-2-2h0c0-.368.299-.667.667-.667Z"
               strokeWidth="0"
               fill="currentColor"
            />
            <line
               x1="15"
               y1="7.5"
               x2="15"
               y2="2.5"
               fill="none"
               stroke="currentColor"
               strokeLinecap="round"
               strokeLinejoin="round"
               strokeWidth="1.75"
            />
            <path
               d="m9.633,3.018c-3.694.192-6.633,3.239-6.633,6.982,0,3.866,3.134,7,7,7,3.742,0,6.79-2.939,6.982-6.633"
               fill="none"
               stroke="currentColor"
               strokeLinecap="round"
               strokeLinejoin="round"
               strokeWidth="1.75"
            />
            <line
               x1="12.5"
               y1="5"
               x2="17.5"
               y2="5"
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
