import Button from '@components/Button';
import ToggleThemeButton from './components/ToggleThemeButton';
import ChangeLangButton from './components/ChangeLangButton';
import { useTranslation } from 'react-i18next';
import Logo from './components/Logo';
import classNames from 'classnames';
import { useNavigate } from 'react-router-dom';
import paths from '@routers/router.path';
import { useAppSelector } from '@hooks/redux.hook';
import authFeature from '@features/auth';
import User from './components/User';
import Nav from './components/Nav';

function ModeratorHeader() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector(
    authFeature.authSelector.selectAuthenticated
  );

  return (
    <div className="sticky top-0 left-0 z-[4] border-solid border-b-[1px] border-[var(--gray)] bg-inherit">
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
        <div className="flex justify-between h-16 ">
          <div className="flex items-center">
            <Logo />
          </div>

          <div className="flex items-center space-x-2.5">
            <ToggleThemeButton />
            <ChangeLangButton />
            <div
              className="pl-2"
              style={{
                display: isAuthenticated ? 'block' : 'none',
              }}
            >
            </div>
            <div className="pl-2">
              <User />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModeratorHeader;
