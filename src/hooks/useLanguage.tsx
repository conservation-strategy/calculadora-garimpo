import { useState, useEffect } from 'react'

type Language = 'en' | 'es' | 'pt'

export default function useLanguage(): Language | null {
  const [language, setLanguage] = useState<Language | null>(null)

  useEffect(() => {
    const userLang = navigator.language.slice(0, 2)

    if (['es', 'pt', 'en'].includes(userLang)) {
      setLanguage(userLang as Language)
    } else {
      setLanguage('en')
    }
  }, [])

  return language
}
