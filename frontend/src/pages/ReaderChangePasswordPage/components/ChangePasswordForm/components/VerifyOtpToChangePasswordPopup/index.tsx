import apis from '@apis/index';
import Popup from '@components/Popup';
import { OtpVerificationType } from '@constants/user.constants';
import useFetch from '@hooks/fetch.hook';
import { memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import OtpVerificationForm from './components/OtpVerificationForm';
import { VerifyOtpToChangePasswordPopupProps } from './VerifyOtpToChangePasswordPopup.type';

function VerifyOtpToChangePasswordPopup({
  data,
  onClose,
}: VerifyOtpToChangePasswordPopupProps) {
  const { t } = useTranslation();
  const [hiddenResendBtn, setHiddenResendBtn] = useState<boolean>(false);
  const [second, setSecond] = useState<number>(0);
  const { setRefetch: setResendOtp } = useFetch(
    apis.authApi.resendOtp,
    {
      body: {
        type: OtpVerificationType.CHANGE_PASSWORD,
        email: data.email,
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
    <Popup
      title={t(
        'reader.changePasswordPage.changePasswordForm.verifyOtpToChangePasswordPopup.title'
      )}
      onClose={onClose}
    >
      <div>
        <div className="flex justify-between items-center bg-[var(--primary)] p-4 text-[var(--white)] space-x-4 rounded-[4px]">
          <div className="text-[1.6rem]">
            <i className="fa-regular fa-envelope"></i>
          </div>

          <div className="grow">
            {t('reader.otpVerificationPage.sentOtpMessage', {
              email: data.email,
            })}
          </div>
        </div>

        <div className="mt-4">
          <OtpVerificationForm data={data} onClose={onClose} />
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
    </Popup>
  );
}

export default memo(VerifyOtpToChangePasswordPopup);
