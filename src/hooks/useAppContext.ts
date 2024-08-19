import { AppContext } from '@/store'
import { useContext } from 'react'

export default function useAppContext() {
  const context = useContext(AppContext)
  return context
}
