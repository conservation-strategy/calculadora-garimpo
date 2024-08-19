import { useEffect, useState } from 'react'

export default function useResize() {
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  const [ismobileOrTablet, setIsMobileOrTablet] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      const { userAgent } = navigator

      let isMobile = false
      let isTablet = false
      let isMobileOrTablet = false

      const isTabletNotMobile =
        ((/Mobi/.test(userAgent) || /Android/.test(userAgent)) === true &&
          /iPad/.test(userAgent)) ||
        /Tablet/.test(userAgent) === true
      const isMobileAndNotTablet =
        ((/Mobi/.test(userAgent) || /Android/.test(userAgent)) == true &&
          !/iPad/.test(userAgent)) ||
        !/Tablet/.test(userAgent) == false

      if (isTabletNotMobile) {
        isMobile = false
        isTablet = true
      } else if (isMobileAndNotTablet) {
        isMobile = true
        isTablet = false
      } else {
        isMobile = false
        isTablet = false
      }

      isMobileOrTablet = isMobile || isTablet

      setIsMobile(isMobile)
      setIsTablet(isTablet)
      setIsMobileOrTablet(isMobileOrTablet)
    }

    window.addEventListener('resize', handleResize)
    handleResize()

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return { isMobile, isTablet, ismobileOrTablet }
}
