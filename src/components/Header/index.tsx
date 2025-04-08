// import { ROUTE } from '@/enums'
import useAppContext from '@/hooks/useAppContext'
import useResize from '@/hooks/useResize'
import * as SG from '@/styles/global'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useRef, useState } from 'react';
import * as S from './style'
import Image from 'next/image'
import Link from 'next/link'

export default function Header() {
  const [dropdown, setDropdown] = useState(false)
  const [openMenu, setMenu] = useState(false)
  const { state, changeLanguage } = useAppContext()
  const { ismobileOrTablet } = useResize()
  const route = useRouter()
  // const [hasScrolled, setHasScrolled] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);


  const { language } = state
  const { header } = language
  const { menu } = header

  const handleDropdown = useCallback(() => {
    setDropdown((prevState) => !prevState)
  }, [])

  // const handleClickOutsideDropdown = useCallback(() => {
  //   console.log('onblur active')
  //   if(timeoutRef.current) clearTimeout(timeoutRef.current);
  //   timeoutRef.current = setTimeout(() => {
  //     console.log('disabling dropdown')
  //     setDropdown(false);
  //   }, 200);
  // },[timeoutRef.current]);

  useEffect(() => {
    return () => {
      if(timeoutRef.current) clearTimeout(timeoutRef.current);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdown(false);
      }
    };
  
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // useEffect(() => {
  //   const handleScroll = () => {
  //     const scrollTop = window.scrollY;
  //     if (scrollTop > 0) {
  //       setHasScrolled(true);
  //     } else {
  //       setHasScrolled(false);
  //     }
  //   };
  
  //   window.addEventListener('scroll', handleScroll);
  //   return () => window.removeEventListener('scroll', handleScroll);
  // }, []);

  return (
    <S.Container>
      {ismobileOrTablet && openMenu && (
        <S.Overlay onClick={() => setMenu(false)} />
      )}

      <SG.Container variant='nav'>
        {/* <S.Logo onClick={() => route.push(ROUTE.home)}>
          <img src="/assets/images/logo-garimpo-invertido.png" alt="Garimpo" />
        </S.Logo> */}
        <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1.5rem'
        }}
        >
          <Link href={'/'}>
            <Image 
              src={'/assets/images/logo_garimpo-principal.png'} 
              alt='Garimpo' 
              width={64}
              height={64}
              sizes="(max-width: 768px) 48px, 64px"
              priority
              style={{ width: 'auto', height: 'auto' }}
            />
          </Link>
          {!ismobileOrTablet &&
            <S.MenuDesktop>
              {menu.map((item) => (
                <S.MenuItem key={item.label} onClick={() => route.push(item.href)}>
                  {item.label}
                </S.MenuItem>
              ))}
            </S.MenuDesktop>
          }
        </div>
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
            <S.DropDown 
            onClick={handleDropdown}
            // onBlur={handleClickOutsideDropdown}
            >
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
          <div style={{
            display: 'flex',
            gap: '0.75rem',
            alignItems: 'center'
          }}>
            <S.DropDown 
            onClick={handleDropdown}
            ref={dropdownRef}
            >
              <S.DropDownText>{language.label}</S.DropDownText>
              <i className="fi fi-rr-angle-small-down"
              style={{
                height: '16px',
                transition: 'transform 0.2s',
                transitionDelay: '0.2s',
                transformOrigin: 'center',
                transform: `${dropdown ? 'scaleY(-1)' : ''}`
              }}
              ></i>
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
            <div style={{ backgroundColor: "#F7EEEE" , width: '1px', height: '2.5rem' , opacity: 0.3 }}></div>
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
          </div>
        )}

        {/* <S.Logo>
          <img src="/assets/images/logo.png" alt="CSF" style={{marginLeft: '10px'}} />
        </S.Logo> */}
        
      </SG.Container>
    </S.Container>
  )
}
