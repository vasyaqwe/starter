import type * as React from "react"

type IconProps = React.ComponentProps<"svg">

export const Icons = {
   popupArrow: (props: IconProps) => (
      <svg
         width="20"
         height="10"
         viewBox="0 0 20 10"
         fill="none"
         {...props}
      >
         <path
            d="M9.66437 2.60207L4.80758 6.97318C4.07308 7.63423 3.11989 8 2.13172 8H0V10H20V8H18.5349C17.5468 8 16.5936 7.63423 15.8591 6.97318L11.0023 2.60207C10.622 2.2598 10.0447 2.25979 9.66437 2.60207Z"
            className="fill-gray-12 dark:fill-gray-3"
         />
         <path d="M8.99542 1.85876C9.75604 1.17425 10.9106 1.17422 11.6713 1.85878L16.5281 6.22989C17.0789 6.72568 17.7938 7.00001 18.5349 7.00001L15.89 7L11.0023 2.60207C10.622 2.2598 10.0447 2.2598 9.66436 2.60207L4.77734 7L2.13171 7.00001C2.87284 7.00001 3.58774 6.72568 4.13861 6.22989L8.99542 1.85876Z" />
         <path
            d="M10.3333 3.34539L5.47654 7.71648C4.55842 8.54279 3.36693 9 2.13172 9H0V8H2.13172C3.11989 8 4.07308 7.63423 4.80758 6.97318L9.66437 2.60207C10.0447 2.25979 10.622 2.2598 11.0023 2.60207L15.8591 6.97318C16.5936 7.63423 17.5468 8 18.5349 8H20V9H18.5349C17.2998 9 16.1083 8.54278 15.1901 7.71648L10.3333 3.34539Z"
            className="fill-transparent dark:fill-gray-6"
         />
      </svg>
   ),
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
               strokeWidth="1.5"
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
               strokeWidth="1.5"
            />
            <path
               d="m9.633,3.018c-3.694.192-6.633,3.239-6.633,6.982,0,3.866,3.134,7,7,7,3.742,0,6.79-2.939,6.982-6.633"
               fill="none"
               stroke="currentColor"
               strokeLinecap="round"
               strokeLinejoin="round"
               strokeWidth="1.5"
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
               strokeWidth="1.5"
            />
         </g>
      </svg>
   ),
   chevronDown: (props: IconProps) => (
      <svg
         viewBox="0 0 10 7"
         fill="none"
         xmlns="http://www.w3.org/2000/svg"
         {...props}
      >
         <path
            d="M1 1.13916C2.06206 2.60104 3.30708 3.91044 4.70212 5.03336C4.87737 5.17443 5.12263 5.17443 5.29788 5.03336C6.69292 3.91044 7.93794 2.60104 9 1.13916"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
         />
      </svg>
   ),
   ellipsisHorizontal: (props: IconProps) => (
      <svg
         xmlns="http://www.w3.org/2000/svg"
         fill="none"
         viewBox="0 0 24 24"
         strokeWidth="1.5"
         stroke="currentColor"
         {...props}
      >
         <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
         />
      </svg>
   ),
   trash: (props: IconProps) => (
      <svg
         xmlns="http://www.w3.org/2000/svg"
         viewBox="0 0 20 20"
         {...props}
      >
         <g fill="currentColor">
            <line
               x1="17"
               y1="5"
               x2="3"
               y2="5"
               fill="none"
               stroke="currentColor"
               strokeLinecap="round"
               strokeLinejoin="round"
               strokeWidth="1.75"
            />
            <rect
               x="8"
               y="3"
               width="4"
               height="2"
               stroke="currentColor"
               strokeLinecap="round"
               strokeLinejoin="round"
               strokeWidth="1.75"
               fill="currentColor"
            />
            <path
               d="m14.95,8l-.355,7.1c-.053,1.064-.932,1.9-1.998,1.9h-5.195c-1.066,0-1.944-.836-1.998-1.9l-.355-7.1"
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
