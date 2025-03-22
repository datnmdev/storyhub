import { memo } from 'react';
import Logo from '@assets/icons/logo.png';
import { useTranslation } from 'react-i18next';
import ForgotPasswordForm from './components/ForgotPasswordForm';
import { Link } from 'react-router-dom';
import paths from '@routers/router.path';

function ForgotPasswordPage() {
  const { t } = useTranslation();

  return (
    <div>
      <div className="desktop:w-[var(--desktop-container-w)] tablet:w-[var(--tablet-container-w)] mobile:w-[var(--mobile-container-w)] mx-auto py-8 flex justify-center items-center">
        <div className="desktop:w-[415px] tablet:w-full mobile:w-full p-8 space-y-4 shadow-[0_0_8px_var(--gray)]">
          <div>
            <img className="w-60 mx-auto" src={Logo} alt="Logo" />
          </div>

          <div>
            <div className="mt-6">
              <div className="text-center text-[1.18rem] font-semibold">
                {t('reader.forgotPasswordPage.title')}
              </div>

              <div className="mt-4">
                <ForgotPasswordForm />
              </div>

              <div className="mt-6 flex justify-center items-center text-[--primary] hover:opacity-60">
                <Link to={paths.signInPage()}>
                  {t('reader.forgotPasswordPage.btn.goBack')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(ForgotPasswordPage);
