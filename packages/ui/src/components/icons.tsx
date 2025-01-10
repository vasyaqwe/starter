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
            className="fill-primary-12 dark:fill-primary-3"
         />
         <path d="M8.99542 1.85876C9.75604 1.17425 10.9106 1.17422 11.6713 1.85878L16.5281 6.22989C17.0789 6.72568 17.7938 7.00001 18.5349 7.00001L15.89 7L11.0023 2.60207C10.622 2.2598 10.0447 2.2598 9.66436 2.60207L4.77734 7L2.13171 7.00001C2.87284 7.00001 3.58774 6.72568 4.13861 6.22989L8.99542 1.85876Z" />
         <path
            d="M10.3333 3.34539L5.47654 7.71648C4.55842 8.54279 3.36693 9 2.13172 9H0V8H2.13172C3.11989 8 4.07308 7.63423 4.80758 6.97318L9.66437 2.60207C10.0447 2.25979 10.622 2.2598 11.0023 2.60207L15.8591 6.97318C16.5936 7.63423 17.5468 8 18.5349 8H20V9H18.5349C17.2998 9 16.1083 8.54278 15.1901 7.71648L10.3333 3.34539Z"
            className="fill-transparent dark:fill-primary-6"
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
               strokeWidth="2"
            />
            <path
               d="m16,10v4c0,1.657-1.343,3-3,3h-6c-1.657,0-3-1.343-3-3v-4"
               fill="none"
               stroke="currentColor"
               strokeLinecap="round"
               strokeLinejoin="round"
               strokeWidth="2"
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
               strokeWidth="2"
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
               strokeWidth="2"
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
   gear: (props: IconProps) => (
      <svg
         xmlns="http://www.w3.org/2000/svg"
         viewBox="0 0 20 20"
         {...props}
      >
         <g fill="currentColor">
            <path
               d="m17.447,8.605l-.673-.336c-.167-.653-.425-1.268-.761-1.834l.238-.715c.12-.359.026-.756-.242-1.023l-.707-.707c-.268-.269-.665-.363-1.023-.242l-.715.238c-.565-.336-1.181-.594-1.834-.761l-.336-.673c-.169-.339-.516-.553-.895-.553h-1c-.379,0-.725.214-.895.553l-.336.673c-.653.167-1.268.425-1.834.761l-.715-.238c-.359-.121-.755-.026-1.023.242l-.707.707c-.268.268-.361.664-.242,1.023l.238.715c-.336.565-.594,1.181-.761,1.834l-.673.336c-.339.169-.553.516-.553.895v1c0,.379.214.725.553.895l.673.336c.167.653.425,1.268.761,1.834l-.238.715c-.12.359-.026.756.242,1.023l.707.707c.19.191.446.293.707.293.106,0,.212-.017.316-.051l.715-.238c.565.336,1.181.594,1.834.761l.336.673c.169.339.516.553.895.553h1c.379,0,.725-.214.895-.553l.336-.673c.653-.167,1.268-.425,1.834-.761l.715.238c.104.035.21.051.316.051.261,0,.517-.103.707-.293l.707-.707c.268-.268.361-.664.242-1.023l-.238-.715c.336-.565.594-1.181.761-1.834l.673-.336c.339-.169.553-.516.553-.895v-1c0-.379-.214-.725-.553-.895Zm-7.447,6.395c-2.761,0-5-2.239-5-5s2.239-5,5-5,5,2.239,5,5-2.239,5-5,5Z"
               strokeWidth="0"
               fill="currentColor"
            />
         </g>
      </svg>
   ),
   gearSolid: (props: IconProps) => (
      <svg
         viewBox="0 0 20 20"
         fill="none"
         xmlns="http://www.w3.org/2000/svg"
         {...props}
      >
         <path
            d="M17.449 8.606L16.776 8.27C16.609 7.617 16.351 7.002 16.015 6.436L16.253 5.721C16.373 5.362 16.279 4.965 16.011 4.698L15.304 3.991C15.036 3.722 14.639 3.628 14.281 3.749L13.566 3.987C13.001 3.651 12.385 3.393 11.732 3.226L11.396 2.553C11.227 2.214 10.88 2 10.501 2H9.501C9.122 2 8.776 2.214 8.606 2.553L8.27 3.226C7.617 3.393 7.002 3.651 6.436 3.987L5.721 3.749C5.362 3.628 4.966 3.723 4.698 3.991L3.991 4.698C3.723 4.966 3.63 5.362 3.749 5.721L3.987 6.436C3.651 7.001 3.393 7.617 3.226 8.27L2.553 8.606C2.214 8.775 2 9.122 2 9.501V10.501C2 10.88 2.214 11.226 2.553 11.396L3.226 11.732C3.393 12.385 3.651 13 3.987 13.566L3.749 14.281C3.629 14.64 3.723 15.037 3.991 15.304L4.698 16.011C4.888 16.202 5.144 16.304 5.405 16.304C5.511 16.304 5.617 16.287 5.721 16.253L6.436 16.015C7.001 16.351 7.617 16.609 8.27 16.776L8.606 17.449C8.775 17.788 9.122 18.002 9.501 18.002H10.501C10.88 18.002 11.226 17.788 11.396 17.449L11.732 16.776C12.385 16.609 13 16.351 13.566 16.015L14.281 16.253C14.385 16.288 14.491 16.304 14.597 16.304C14.858 16.304 15.114 16.201 15.304 16.011L16.011 15.304C16.279 15.036 16.372 14.64 16.253 14.281L16.015 13.566C16.351 13.001 16.609 12.385 16.776 11.732L17.449 11.396C17.788 11.227 18.002 10.88 18.002 10.501V9.501C18.002 9.122 17.788 8.776 17.449 8.606ZM10.002 15.001C7.241 15.001 5.002 12.762 5.002 10.001C5.002 7.24 7.241 5.001 10.002 5.001C12.763 5.001 15.002 7.24 15.002 10.001C15.002 12.762 12.763 15.001 10.002 15.001Z"
            fill="currentColor"
         />
         <circle
            cx="10"
            cy="10"
            r="5.5"
            fill="currentColor"
         />
      </svg>
   ),
   xMark: (props: IconProps) => (
      <svg
         xmlns="http://www.w3.org/2000/svg"
         viewBox="0 0 18 18"
         {...props}
      >
         <g fill="currentColor">
            <path
               d="M14 4L4 14"
               stroke="currentColor"
               strokeWidth="2"
               strokeLinecap="round"
               strokeLinejoin="round"
               fill="none"
            />{" "}
            <path
               d="M4 4L14 14"
               stroke="currentColor"
               strokeWidth="2"
               strokeLinecap="round"
               strokeLinejoin="round"
               fill="none"
            />
         </g>
      </svg>
   ),
   shift: (props: IconProps) => (
      <svg
         xmlns="http://www.w3.org/2000/svg"
         viewBox="0 0 24 24"
         fill="none"
         stroke="currentColor"
         strokeWidth="2"
         strokeLinecap="round"
         strokeLinejoin="round"
         {...props}
      >
         <path d="M9 18v-6H5l7-7 7 7h-4v6H9z" />
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
   arrowLeft: (props: IconProps) => (
      <svg
         viewBox="0 0 24 24"
         fill="none"
         xmlns="http://www.w3.org/2000/svg"
         {...props}
      >
         <path
            d="M9.8304 6C7.727 7.55556 5.83783 9.37278 4.20952 11.4057C4.06984 11.5801 4 11.79 4 12M9.8304 18C7.727 16.4444 5.83783 14.6272 4.20952 12.5943C4.06984 12.4199 4 12.21 4 12M4 12H20"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
         />
      </svg>
   ),
   chevronLeft: (props: IconProps) => (
      <svg
         xmlns="http://www.w3.org/2000/svg"
         fill="none"
         viewBox="0 0 24 24"
         strokeWidth="2"
         stroke="currentColor"
         {...props}
      >
         <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5 8.25 12l7.5-7.5"
         />
      </svg>
   ),
   chevronRight: (props: IconProps) => (
      <svg
         xmlns="http://www.w3.org/2000/svg"
         fill="none"
         viewBox="0 0 24 24"
         strokeWidth="2"
         stroke="currentColor"
         {...props}
      >
         <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m8.25 4.5 7.5 7.5-7.5 7.5"
         />
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
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
         />
      </svg>
   ),
   chevronUpDown: (props: IconProps) => (
      <svg
         xmlns="http://www.w3.org/2000/svg"
         fill="none"
         viewBox="0 0 24 24"
         strokeWidth="2"
         stroke="currentColor"
         {...props}
      >
         <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
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
   check: (props: IconProps) => (
      <svg
         xmlns="http://www.w3.org/2000/svg"
         viewBox="0 0 20 20"
         {...props}
      >
         <g fill="currentColor">
            <polyline
               points="4 11 8 15 16 5"
               fill="none"
               stroke="currentColor"
               strokeLinecap="round"
               strokeLinejoin="round"
               strokeWidth="2"
            />
         </g>
      </svg>
   ),
   pencil: (props: IconProps) => (
      <svg
         xmlns="http://www.w3.org/2000/svg"
         viewBox="0 0 20 20"
         {...props}
      >
         <g fill="currentColor">
            <line
               x1="17"
               y1="17"
               x2="12"
               y2="17"
               fill="none"
               stroke="currentColor"
               strokeLinecap="round"
               strokeLinejoin="round"
               strokeWidth="2"
            />
            <path
               d="m3,17l1-5L12.414,3.586c.781-.781,2.047-.781,2.828,0l1.172,1.172c.781.781.781,2.047,0,2.828l-8.414,8.414-5,1Z"
               fill="none"
               stroke="currentColor"
               strokeLinecap="round"
               strokeLinejoin="round"
               strokeWidth="2"
            />
         </g>
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
               strokeWidth="2"
            />
            <rect
               x="8"
               y="3"
               width="4"
               height="2"
               stroke="currentColor"
               strokeLinecap="round"
               strokeLinejoin="round"
               strokeWidth="2"
               fill="currentColor"
            />
            <path
               d="m14.95,8l-.355,7.1c-.053,1.064-.932,1.9-1.998,1.9h-5.195c-1.066,0-1.944-.836-1.998-1.9l-.355-7.1"
               fill="none"
               stroke="currentColor"
               strokeLinecap="round"
               strokeLinejoin="round"
               strokeWidth="2"
            />
         </g>
      </svg>
   ),
}
