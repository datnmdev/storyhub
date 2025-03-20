import Logo from '@assets/icons/logo.png';
import { useTranslation } from 'react-i18next';
import { Link, Location, useLocation } from 'react-router-dom';
import SignInWithEmailForm from './components/SignInWithEmailForm';
import IconButton from '@components/IconButton';
import GoogleIcon from '@assets/icons/static/google.png';
import FacebookIcon from '@assets/icons/static/facebook.png';
import { LocationState } from '@type/reactRouterDom.type';
import UrlUtils from '@utilities/url.util';
import paths from '@routers/router.path';

function SignInPage() {
  const { t } = useTranslation();
  const location: Location<LocationState> = useLocation();

  return (
    <div>
      <div className="desktop:w-[var(--desktop-container-w)] tablet:w-[var(--tablet-container-w)] mobile:w-[var(--mobile-container-w)] mx-auto py-8 flex justify-center items-center">
        <div className="desktop:w-[415px] tablet:w-full mobile:w-full p-8 space-y-4 shadow-[0_0_8px_var(--gray)]">
          <div>
            <img className="w-60 mx-auto" src={Logo} alt="Logo" />
          </div>

          <div>
            <ul className="flex border-[1px] border-solid border-[var(--gray)] rounded-[4px]">
              <li className="grow">
                <Link
                  className="block text-center w-full py-2.5 bg-[var(--primary)] text-[var(--white)]"
                  to={paths.signInPage()}
                >
                  {t('reader.signInPage.signIn')}
                </Link>
              </li>

              <li className="grow">
                <Link
                  className="block text-center w-full py-2.5 hover:text-[var(--primary)]"
                  to={paths.signUpPage()}
                >
                  {t('reader.signInPage.signUp')}
                </Link>
              </li>
            </ul>

            <div className="mt-6">
              <div>
                <SignInWithEmailForm />
              </div>

              <div>
                <div className="uppercase font-semibold text-[var(--dark-gray)] text-[0.925rem] text-center py-4">
                  {t('reader.signInPage.or')}
                </div>
                <div className="flex justify-center space-x-4">
                  <IconButton
                    icon={<img width={24} src={GoogleIcon} alt="Google Icon" />}
                    width={48}
                    height={48}
                    bgColor="var(--white)"
                    borderRadius="50%"
                    boxShadow="0 0 4px var(--gray)"
                    onClick={() => {
                      const params = new URLSearchParams({
                        url: `${import.meta.env.VITE_HOST}/${location.state?.from}`,
                        role: location.state?.role || 'guest',
                      });
                      window.location.href = UrlUtils.generateUrl(
                        `/auth/sign-in/google?redirect-to=${encodeURIComponent(`${import.meta.env.VITE_HOST}${paths.authRedirectPage()}?${params.toString()}`)}`
                      );
                    }}
                  />
                  <IconButton
                    icon={
                      <img width={24} src={FacebookIcon} alt="Facebook Icon" />
                    }
                    width={48}
                    height={48}
                    bgColor="var(--white)"
                    borderRadius="50%"
                    boxShadow="0 0 4px var(--gray)"
                    onClick={() => {
                      const params = new URLSearchParams({
                        url: `${import.meta.env.VITE_HOST}}/${location.state?.from}`,
                        role: location.state?.role || 'guest',
                      });
                      window.location.href = UrlUtils.generateUrl(
                        `/auth/sign-in/facebook?redirect-to=${encodeURIComponent(`${import.meta.env.VITE_HOST}${paths.authRedirectPage()}?${params.toString()}`)}`
                      );
                    }}
                  />
                </div>
              </div>

              <div className="mt-6 text-center space-x-1">
                <span>{t('reader.signInPage.noAccount')}</span>
                <Link
                  className="text-[var(--primary)] hover:opacity-60"
                  to={paths.signUpPage()}
                >
                  {t('reader.signInPage.signUpNow')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignInPage;
