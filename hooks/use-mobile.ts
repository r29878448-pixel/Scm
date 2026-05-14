import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(
    typeof window !== 'undefined' ? window.innerWidth < MOBILE_BREAKPOINT : undefined
  )

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    
    // The initial state is already set in the useState initializer for the client
    // So we just need to handle the case where it might change after load
    
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}
