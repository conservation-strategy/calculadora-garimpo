import { AppContext } from '@/store/state'
import { useContext } from 'react'

export default function useAppContext() {
  const context = useContext(AppContext)
  return context
}
