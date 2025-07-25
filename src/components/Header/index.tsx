// import { ROUTE } from '@/enums'
import useAppContext from '@/hooks/useAppContext'
import useResize from '@/hooks/useResize'
import * as SG from '@/styles/global'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useRef, useState } from 'react';
import * as S from './style'
import Image from 'next/image'
import Link from 'next/link'
import { CloseIcon, CSFLogo } from '../Icons';

export default function Header({
  isScrolled
}: {
  isScrolled: boolean
}) {
  const [dropdown, setDropdown] = useState(false)
  const [openMenu, setMenu] = useState(false)
  const { state, changeLanguage } = useAppContext()
  const { ismobileOrTablet } = useResize()
  const route = useRouter()
  // const [isScrolled, setIsScrolled] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);


  const { language } = state
  const { header } = language
  const { menu } = header

  const handleDropdown = useCallback(() => {
    setDropdown((prevState) => !prevState)
  }, []);

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
  //       setIsScrolled(true);
  //     } else {
  //       setIsScrolled(false);
  //     }
  //   };
  
  //   window.addEventListener('scroll', handleScroll);
  //   return () => window.removeEventListener('scroll', handleScroll);
  // }, []);

  return (
    <>
    {/* mobile overlay menu */}
    <S.MenuMobile active={openMenu}>
      <S.MenuTopContainer>
        <S.MenuTop>              
          <S.Logo          
            // className="opacity-[0.6] ml-2"
            src="/assets/images/logo_garimpo-mono_preto.svg"
            alt="Logo Calculadora Garimpo Monocrome preto"
          />
          

          <button
            onClick={() => setMenu(false)}
            style={{ 
              width: '32px'
            }}
          >
            <CloseIcon/>
          </button>         
        </S.MenuTop>
      </S.MenuTopContainer>
      <S.MenuItemsContainer>
        {menu.map((item) => (
          <S.MenuItem key={item.label} onClick={() => route.push(item.href)}>
            {item.label}
          </S.MenuItem>
        ))}
        
        <S.DropDownMobile 
        onClick={handleDropdown}
        ref={dropdownRef}
        >
          <S.DropDownMobileButton>
            <S.DropDownText>{language.label}</S.DropDownText>
            <i className="fi fi-rr-angle-small-down"
            style={{
              position: 'absolute',
              right: 0,
              top: 0,
              bottom: 0,
              marginBlock: 'auto',
              height: '22px',
              marginLeft: '0.5rem',
              transition: 'transform 0.2s',
              transitionDelay: '0.2s',
              transformOrigin: 'center',
              transform: `${dropdown ? 'scaleY(-1)' : 'scaleY(1)'}`
            }}></i>
          </S.DropDownMobileButton>
          <S.DropDownBoxMobile active={dropdown}>
            <div onClick={() => changeLanguage('pt_BR')}>
              Português
            </div>
            <div onClick={() => changeLanguage('es_ES')}>
              Español
            </div>
            <div onClick={() => changeLanguage('en_US')}>
              English
            </div>
          </S.DropDownBoxMobile>
        </S.DropDownMobile>
      
      </S.MenuItemsContainer>
      <a 
      href='https://www.conservation-strategy.org/' 
      target='_blank' 
      rel='noreferrer' 
      style={{ 
        opacity: 0.6,
        transform: 'translateY(.125rem)',
        width: '34px',
        color: 'inherit'
      }}
      >
        <CSFLogo/>
      </a>
    </S.MenuMobile>

    {/* navbar */}
    <S.Container isScrolled={isScrolled}>
      {/* {ismobileOrTablet && openMenu && (
        <S.Overlay onClick={() => setMenu(false)} />
      )} */}

      

      <SG.Container padding='16px 24px'>
        {/* <S.Logo onClick={() => route.push(ROUTE.home)}>
          <img src="/assets/images/logo-garimpo-invertido.png" alt="Garimpo" />
        </S.Logo> */}
        <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '3rem'
        }}
        >

          <Link href={'/'}>
            <S.Logo 
              src={'/assets/images/logo_garimpo-principal.svg'} 
              alt='Logo Calculadora Garimpo' 
            />
          </Link>
          
            <S.MenuDesktop>
              {menu.map((item) => (
                <S.MenuItem key={item.label} onClick={() => route.push(item.href)}
                style={{ fontWeight: '700', letterSpacing: '0.025em' }}
                >
                  {item.label}
                </S.MenuItem>
              ))}
            </S.MenuDesktop>
        
        </div>
        
        <S.ButtonBarMenu onClick={() => setMenu(true)}>
          <i className="fi fi-rr-menu-burger"></i>
        </S.ButtonBarMenu>
      
        {/* only desktop */}
        <S.LogoDropdownContainer>
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
              transform: `${dropdown ? 'scaleY(-1)' : 'scaleY(1)'}`
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
        </S.LogoDropdownContainer>
        {/*  */}

        {/* <S.Logo>
          <img src="/assets/images/logo.png" alt="CSF" style={{marginLeft: '10px'}} />
        </S.Logo> */}
        
      </SG.Container>
    </S.Container>
    </>
  )
}
