import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <svg
          width="48"
          height="62"
          viewBox="0 0 48 62"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-auto"
        >
          <defs>
            <linearGradient id="grad1" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FFC837" />
              <stop offset="100%" stopColor="#FF8008" />
            </linearGradient>
            <linearGradient id="grad2" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#56CCF2" />
              <stop offset="100%" stopColor="#2F80ED" />
            </linearGradient>
          </defs>
          <path
            d="M24 13.5C18.201 13.5 13.5 18.201 13.5 24C13.5 29.799 18.201 34.5 24 34.5C29.799 34.5 34.5 29.799 34.5 24C34.5 18.201 29.799 13.5 24 13.5ZM24 31.5C19.86 31.5 16.5 28.14 16.5 24C16.5 19.86 19.86 16.5 24 16.5C28.14 16.5 31.5 19.86 31.5 24C31.5 28.14 28.14 31.5 24 31.5Z"
            fill="url(#grad1)"
            transform="translate(0, -11)"
          />
          <path
            d="M24 27.5C18.201 27.5 13.5 32.201 13.5 38C13.5 43.799 18.201 48.5 24 48.5C29.799 48.5 34.5 43.799 34.5 38C34.5 32.201 29.799 27.5 24 27.5ZM24 45.5C19.86 45.5 16.5 42.14 16.5 38C16.5 33.86 19.86 30.5 24 30.5C28.14 30.5 31.5 33.86 31.5 38C31.5 42.14 28.14 45.5 24 45.5Z"
            fill="url(#grad2)"
            transform="translate(0, -11)"
          />
           <text x="0" y="58" fontFamily="Poppins, sans-serif" fontSize="16" fontWeight="bold" fill="currentColor">
            Pixel8
          </text>
        </svg>
      </div>
    );
  }
  
  export function Favicon() {
    return (
      <svg
          width="32"
          height="32"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="grad1" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FFC837" />
              <stop offset="100%" stopColor="#FF8008" />
            </linearGradient>
            <linearGradient id="grad2" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#56CCF2" />
              <stop offset="100%" stopColor="#2F80ED" />
            </linearGradient>
          </defs>
          <path
            d="M20 7.5C14.201 7.5 9.5 12.201 9.5 18C9.5 23.799 14.201 28.5 20 28.5C25.799 28.5 30.5 23.799 30.5 18C30.5 12.201 25.799 7.5 20 7.5ZM20 25.5C15.86 25.5 12.5 22.14 12.5 18C12.5 13.86 15.86 10.5 20 10.5C24.14 10.5 27.5 13.86 27.5 18C27.5 22.14 24.14 25.5 20 25.5Z"
            fill="url(#grad1)"
            transform="translate(0, -7)"
          />
          <path
            d="M20 21.5C14.201 21.5 9.5 26.201 9.5 32C9.5 37.799 14.201 42.5 20 42.5C25.799 42.5 30.5 37.799 30.5 32C30.5 26.201 25.799 21.5 20 21.5ZM20 39.5C15.86 39.5 12.5 36.14 12.5 32C12.5 27.86 15.86 24.5 20 24.5C24.14 24.5 27.5 27.86 27.5 32C27.5 36.14 24.14 39.5 20 39.5Z"
            fill="url(#grad2)"
            transform="translate(0, -7)"
          />
      </svg>
    )
  }
  