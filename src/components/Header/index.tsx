import { ROUTE } from '@/enums'
import useAppContext from '@/hooks/useAppContext'
import useResize from '@/hooks/useResize'
import * as SG from '@/styles/global'
import { useRouter } from 'next/router'
import { useCallback, useState } from 'react'
import * as S from './style'
import Image from 'next/image'
import Link from 'next/link'

export default function Header() {
  const [dropdown, setDropdown] = useState(false)
  const [openMenu, setMenu] = useState(false)
  const { state, changeLanguage } = useAppContext()
  const { ismobileOrTablet } = useResize()
  const route = useRouter()

  const { language } = state
  const { header } = language
  const { menu } = header

  const handleDropdown = useCallback(() => {
    setDropdown((prevState) => !prevState)
  }, [])

  return (
    <S.Container>
      {ismobileOrTablet && openMenu && (
        <S.Overlay onClick={() => setMenu(false)} />
      )}

      <SG.Container>
        {/* <S.Logo onClick={() => route.push(ROUTE.home)}>
          <img src="/assets/images/logo-garimpo-invertido.png" alt="Garimpo" />
        </S.Logo> */}
        <Link href={'/'}>
          <Image 
            src={'/assets/images/logo-Garimpo_BordaBranca.svg'} 
            alt='Garimpo' 
            width={64}
            height={64}
            sizes="(max-width: 1024px) 40px, 64px"
            priority
          />
        </Link>
        {ismobileOrTablet && (
          <S.ButtonBarMenu onClick={() => setMenu(true)}>
            <i className="fi fi-rr-menu-burger"></i>
          </S.ButtonBarMenu>
        )}

        <S.Menu active={openMenu}>
          {ismobileOrTablet && (
            <S.MenuTop>
              <S.MenuItem
                onClick={() => setMenu(false)}
                style={{ fontSize: '40px' }}
              >
                <i className="fi fi-rr-rectangle-xmark"></i>
              </S.MenuItem>
              <a href='https://www.conservation-strategy.org/' target='_blank' rel='noreferrer' style={{ opacity: 0.6, marginLeft: '10px' }}>
                <Image          
                  // className="opacity-[0.6] ml-2"
                  src="/assets/images/logo.png"
                  alt="CSF"
                  width={34}
                  height={34}
                  sizes="(max-width: 1024px) 40px, 34px"
                  priority
                />
              </a>              
            </S.MenuTop>
          )}
          {menu.map((item) => (
            <S.MenuItem key={item.label} onClick={() => route.push(item.href)}>
              {item.label}
            </S.MenuItem>
          ))}
          {ismobileOrTablet && (
            <S.DropDown onClick={handleDropdown}>
              <S.DropDownText>{language.label}</S.DropDownText>
              <i className="fi fi-rr-angle-small-down"></i>
              <S.DropDownBox active={dropdown}>
                <S.DropdownItem onClick={() => changeLanguage('pt_BR')}>
                  Português
                </S.DropdownItem>
                <S.DropdownItem onClick={() => changeLanguage('es_ES')}>
                  Español
                </S.DropdownItem>
                <S.DropdownItem onClick={() => changeLanguage('en_US')}>
                  English
                </S.DropdownItem>
              </S.DropDownBox>
            </S.DropDown>
          )}
        </S.Menu>

        

        {!ismobileOrTablet && (
          <>
          <S.DropDown onClick={handleDropdown}>
            <S.DropDownText>{language.label}</S.DropDownText>
            <i className="fi fi-rr-angle-small-down"></i>
            <S.DropDownBox active={dropdown}>
              <S.DropdownItem onClick={() => changeLanguage('pt_BR')}>
                Português
              </S.DropdownItem>
              <S.DropdownItem onClick={() => changeLanguage('es_ES')}>
                Español
              </S.DropdownItem>
              <S.DropdownItem onClick={() => changeLanguage('en_US')}>
                English
              </S.DropdownItem>
            </S.DropDownBox>
          </S.DropDown>
          <a href='https://www.conservation-strategy.org/' target='_blank' rel='noreferrer' style={{ opacity: 0.6, marginLeft: '10px' }}>
            <Image          
              // className="opacity-[0.6] ml-2"
              src="/assets/images/logo.png"
              alt="CSF"
              width={34}
              height={34}
              sizes="(max-width: 1024px) 40px, 34px"
              priority
            />
          </a>
          </>
        )}

        {/* <S.Logo>
          <img src="/assets/images/logo.png" alt="CSF" style={{marginLeft: '10px'}} />
        </S.Logo> */}
        
      </SG.Container>
    </S.Container>
  )
}
