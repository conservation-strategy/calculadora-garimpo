import { useState, useEffect } from 'react'
import axios from 'axios'
import { CountryProps } from '@/store/proveider'

const brazil: CountryProps = { country: 'BR', label: 'Brasil' }
const Peru: CountryProps = { country: 'PE', label: 'Perú' }
const Ecuador: CountryProps = { country: 'EC', label: 'Ecuador' }
const Colombia: CountryProps = { country: 'CO', label: 'Colombia' }

export default function useCountryDetection() {
  const [country, setCountry] = useState<CountryProps>({
    country: 'BR',
    label: 'Brasil'
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const country = sessionStorage.getItem('country')
    const fetchCountry = async () => {
      try {
        const response = await axios.get(
          `https://api.ipdata.co/?api-key=1dae254879123734d1ae95dfe5cbad0bdf7cae8047108f72f818622a`
        )
        const countrycountry = response.data.country_country.toLowerCase()
        switch (countrycountry) {
          case 'br':
          default:
            setCountry(brazil)
            break
          case 'co':
            setCountry(Colombia)
            break
          case 'ec':
            setCountry(Ecuador)
            break
          case 'pe':
            setCountry(Peru)
            break
        }
      } catch (error) {
        console.error(error)
        setCountry(brazil)
      } finally {
        setLoading(false)
      }
    }
    if (!country) {
      fetchCountry()
    }
  }, [])

  return {
    country,
    loading
  }
}
