import ErrorMessage from '@components/ErrorMessage';
import IconButton from '@components/IconButton';
import InputWithIcon from '@components/InputWithIcon';
import { memo, useEffect } from 'react';
import LoadingIcon from '@assets/icons/gifs/loading.gif';
import { useTranslation } from 'react-i18next';
import { useFormValidation } from '@hooks/validate.hook';
import { generateValidateSchema } from './OtpVerificationForm.schema';
import { InputData, InputError } from './OtpVerificationForm.type';
import useFetch from '@hooks/fetch.hook';
import apis from '@apis/index';
import { useLocation, useNavigate } from 'react-router-dom';
import { OtpVerificationType, Role } from '@constants/user.constants';
import { Token } from '@features/auth/auth.type';
import { useAppDispatch } from '@hooks/redux.hook';
import authFeature from '@features/auth';
import toastFeature from '@features/toast';
import { ToastType } from '@constants/toast.constants';
import paths from '@routers/router.path';

function OtpVerificationForm() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { t } = useTranslation();
  const { values, handleChange, errors, validateAll } = useFormValidation<
    InputData,
    InputError
  >(
    {
      otp: '',
    },
    generateValidateSchema()
  );
  const {
    data: isVerifiedAccount,
    isLoading: isVerifyingAccount,
    error: verifyAccountError,
    setRefetch: setReVerifyAccount,
  } = useFetch<boolean>(
    apis.authApi.verifyAccount,
    {
      body: {
        ...values,
        accountId: location.state?.account?.id,
      },
    },
    false
  );
  const {
    data: signInResData,
    isLoading: isSigningUp,
    error: signInError,
    setRefetch: setReSignIn,
  } = useFetch<Token>(
    apis.authApi.signInWithEmailPassword,
    {
      body: {
        email: location.state?.prevData?.email,
        password: location.state?.prevData?.password,
      },
    },
    false
  );

  useEffect(() => {
    if (
      location.state?.type === OtpVerificationType.SIGN_IN ||
      location.state?.type === OtpVerificationType.SIGN_UP
    ) {
      if (isVerifiedAccount) {
        setReSignIn({
          value: true,
        });
        dispatch(
          toastFeature.toastAction.add({
            type: ToastType.SUCCESS,
            title: t('notification.verifyAccountSuccess'),
          })
        );
      }
    }
  }, [isVerifiedAccount]);

  useEffect(() => {
    if (
      location.state?.type === OtpVerificationType.SIGN_IN ||
      location.state?.type === OtpVerificationType.SIGN_UP
    ) {
      if (signInResData) {
        dispatch(authFeature.authAction.signIn(signInResData));
        navigate(
          `${paths.authRedirectPage()}?${new URLSearchParams({
            url: location.state?.from || '',
            role: location.state?.role as Role,
          }).toString()}`,
          {
            replace: true,
          }
        );
      }
    }
  }, [signInResData]);

  return (
    <div className="space-y-4">
      {verifyAccountError || signInError ? (
        <div className="bg-red-500 text-white p-4 rounded-[4px] animate-fadeIn">
          {t('notification.undefinedError')}
        </div>
      ) : null}
      {isVerifiedAccount !== null && !isVerifiedAccount ? (
        <div className="bg-red-500 text-white p-4 rounded-[4px] animate-fadeIn">
          {t('notification.verifyOtpError')}
        </div>
      ) : null}

      <div>
        <InputWithIcon
          icon={<i className="fa-solid fa-hashtag"></i>}
          name="otp"
          type="text"
          maxLength={6}
          minLength={6}
          placeholder={t('reader.otpVerificationPage.otp')}
          value={values.otp}
          onChange={handleChange}
        />
        {errors.otp && <ErrorMessage message={errors.otp} />}
      </div>

      <div className="flex justify-center">
        <IconButton
          icon={
            isVerifyingAccount || isSigningUp ? (
              <img src={LoadingIcon} />
            ) : (
              <i className="fa-solid fa-arrow-right"></i>
            )
          }
          fontSize="1.4rem"
          width={48}
          height={48}
          color="var(--white)"
          bgColor="var(--primary)"
          borderRadius="50%"
          onClick={async () => {
            if (await validateAll()) {
              switch (location.state?.type) {
                case OtpVerificationType.SIGN_UP:
                case OtpVerificationType.SIGN_IN:
                  setReVerifyAccount({
                    value: true,
                  });
                  break;

                case OtpVerificationType.FORGOT_PASSWORD:
                  break;
              }
            }
          }}
        />
      </div>
    </div>
  );
}

export default memo(OtpVerificationForm);
