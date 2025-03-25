import Button from '@components/Button';
import SearchButton from './components/SearchButton';
import ToggleThemeButton from './components/ToggleThemeButton';
import ChangeLangButton from './components/ChangeLangButton';
import Nav from './components/Nav';
import { useTranslation } from 'react-i18next';
import Logo from './components/Logo';
import classNames from 'classnames';
import { useNavigate } from 'react-router-dom';
import paths from '@routers/router.path';
import { useAppSelector } from '@hooks/redux.hook';
import authFeature from '@features/auth';
import User from './components/User';
import IconButton from '@components/IconButton';
import themeFeature from '@features/theme';
import { useEffect, useRef } from 'react';

function Header() {
  const { t } = useTranslation();
  const themeValue = useAppSelector(themeFeature.themeSelector.selectValue);
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector(
    authFeature.authSelector.selectAuthenticated
  );
  const menuIconRef = useRef<HTMLDivElement>(null);
  const menuBoxRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (menuIconRef.current && menuBoxRef.current && navRef.current) {
      const menuIcon = menuIconRef.current;
      const menuBox = menuBoxRef.current;
      const nav = navRef.current;

      function handlClicked(e: MouseEvent) {
        e.stopPropagation();
        if (menuBox.classList.contains('slide-right-show')) {
          menuBox.classList.remove('slide-right-show');
          menuBox.classList.add('slide-right-hide');
        } else {
          menuBox.classList.remove('slide-right-hide');
          menuBox.classList.add('slide-right-show');
        }
      }
      menuIcon.addEventListener('click', handlClicked);
      nav.addEventListener('click', handlClicked);
      return () => {
        menuIcon.removeEventListener('click', handlClicked);
        nav.removeEventListener('click', handlClicked);
      };
    }
  }, []);

  return (
    <div className="sticky top-0 left-0 z-[2] border-solid border-b-[1px] border-[var(--gray)] bg-inherit">
      {/* Desktop */}
      <div
        className={classNames(
          'w-[var(--desktop-container-w)] mx-auto desktop:flex tablet:hidden mobile:hidden justify-between leading-[64px]'
        )}
      >
        <div className="flex">
          <Logo />
          <Nav />
        </div>

        <div className="flex items-center space-x-4">
          <SearchButton />
          <ToggleThemeButton />
          <ChangeLangButton />
          <div className="pl-2">
            {!isAuthenticated ? (
              <Button onClick={() => navigate(paths.signInPage())}>
                {t('reader.header.btn.signIn')}
              </Button>
            ) : (
              <User />
            )}
          </div>
        </div>
      </div>

      {/* Mobile & Tablet */}
      <div className="tablet:w-[var(--tablet-container-w)] mobile:w-[var(--mobile-container-w)] mx-auto desktop:hidden tablet:block mobile:block">
        <div className="flex justify-between h-12">
          <div className="flex items-center">
            <div ref={menuIconRef}>
              <IconButton
                icon={<i className="fa-solid fa-bars"></i>}
                fontSize="1.2rem"
              />
            </div>

            <div
              ref={menuBoxRef}
              className={classNames(
                'slide-animate fixed top-0 left-0 w-[100vw] h-[100vh] z-[1]',
                themeValue === 'light'
                  ? 'light light__boxShadow'
                  : 'dark dark__boxShadow'
              )}
            >
              <div>
                <div className="flex justify-between items-center p-4">
                  <Logo />
                  <IconButton
                    icon={<i className="fa-solid fa-times"></i>}
                    fontSize="1.6rem"
                    onClick={() => {
                      if (menuBoxRef.current) {
                        menuBoxRef.current.classList.remove('slide-right-show');
                        menuBoxRef.current.classList.add('slide-right-hide');
                      }
                    }}
                  />
                </div>
              </div>

              <div ref={navRef} className="leading-[48px]">
                <Nav />
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-1.5">
            <SearchButton />
            <ToggleThemeButton />
            <ChangeLangButton />
            <div className="pl-2">
              {!isAuthenticated ? (
                <IconButton
                  icon={<i className="fa-solid fa-right-to-bracket"></i>}
                  fontSize="20px"
                  color="var(--primary)"
                  onClick={() => navigate(paths.signInPage())}
                />
              ) : (
                <User />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
