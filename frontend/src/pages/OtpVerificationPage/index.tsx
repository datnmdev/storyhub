import { memo, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Logo from '@assets/icons/logo.png';
import { useTranslation } from 'react-i18next';
import OtpVerificationForm from './components/OtpVerificationForm';
import useFetch from '@hooks/fetch.hook';
import apis from '@apis/index';

function OtpVerificationPage() {
  const location = useLocation();
  const { t } = useTranslation();
  const [hiddenResendBtn, setHiddenResendBtn] = useState<boolean>(false);
  const [second, setSecond] = useState<number>(0);
  const { setRefetch: setResendOtp } = useFetch(
    apis.authApi.resendOtp,
    {
      body: {
        type: location.state?.type,
        email: location.state?.prevData?.email,
      },
    },
    false
  );

  useEffect(() => {
    let intervalId: number;
    if (hiddenResendBtn) {
      setSecond(2 * 60);
      intervalId = setInterval(() => {
        setSecond((prev) => {
          if (prev > 0) {
            return prev - 1;
          } else {
            clearInterval(intervalId);
            return 0;
          }
        });
      }, 1000);
    }
    return () => {
      clearInterval(intervalId);
    };
  }, [hiddenResendBtn]);

  useEffect(() => {
    if (second <= 0) {
      setHiddenResendBtn(false);
    }
  }, [second]);

  return (
    <div>
      <div className="desktop:w-[var(--desktop-container-w)] mx-auto py-8 flex justify-center items-center">
        <div className="w-[415px] p-8 space-y-4 shadow-[0_0_8px_var(--gray)]">
          <div>
            <img className="w-60 mx-auto" src={Logo} alt="Logo" />
          </div>

          <div>
            <div className="mt-6">
              <div className="flex justify-between items-center bg-[var(--primary)] p-4 text-[var(--white)] space-x-4 rounded-[4px]">
                <div className="text-[1.6rem]">
                  <i className="fa-regular fa-envelope"></i>
                </div>

                <div className="grow">
                  {t('reader.otpVerificationPage.sentOtpMessage', {
                    email: location.state?.prevData?.email,
                  })}
                </div>
              </div>

              <div className="mt-4">
                <OtpVerificationForm />
              </div>

              <div className="mt-6 space-x-1">
                <span>{t('reader.otpVerificationPage.notReceiveOtp')}</span>

                {hiddenResendBtn ? (
                  <span className="text-[var(--primary)] opacity-80">
                    {t('reader.otpVerificationPage.resendRequest', { second })}
                  </span>
                ) : (
                  <span
                    className="text-[var(--primary)] cursor-pointer hover:opacity-60"
                    onClick={() => {
                      setHiddenResendBtn(true);
                      setResendOtp({
                        value: true,
                      });
                    }}
                  >
                    {t('reader.otpVerificationPage.btn.resendOtp')}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(OtpVerificationPage);
