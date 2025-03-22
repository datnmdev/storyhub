import ErrorMessage from '@components/ErrorMessage';
import IconButton from '@components/IconButton';
import InputWithIcon from '@components/InputWithIcon';
import { memo, useEffect } from 'react';
import LoadingIcon from '@assets/icons/gifs/loading.gif';
import { generateValidateSchema } from './ForgotPasswordForm.schema';
import useFetch from '@hooks/fetch.hook';
import { useTranslation } from 'react-i18next';
import { useFormValidation } from '@hooks/validate.hook';
import { InputData, InputError } from './ForgotPasswordForm.type';
import apis from '@apis/index';
import { OtpVerificationType } from '@constants/user.constants';
import { useNavigate } from 'react-router-dom';
import paths from '@routers/router.path';

function ForgotPasswordForm() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { values, handleChange, errors, validateAll } = useFormValidation<
    InputData,
    InputError
  >(
    {
      email: '',
    },
    generateValidateSchema()
  );
  const { data, isLoading, error, setRefetch } = useFetch<boolean>(
    apis.authApi.resendOtp,
    {
      body: {
        email: values.email,
        type: OtpVerificationType.FORGOT_PASSWORD,
      },
    },
    false
  );

  useEffect(() => {
    if (data) {
      navigate(paths.otpVerificationPage(), {
        state: {
          type: OtpVerificationType.FORGOT_PASSWORD,
          prevData: values,
        },
      });
    }
  }, [data]);

  return (
    <div className="space-y-2">
      {error && (
        <div className="bg-red-500 text-white p-4 rounded-[4px] animate-fadeIn">
          {t('notification.undefinedError')}
        </div>
      )}

      <div>
        <InputWithIcon
          name="email"
          type="email"
          placeholder={t('reader.signInPage.email')}
          value={values.email}
          onChange={handleChange}
        />
        {errors.email && <ErrorMessage message={errors.email} />}
      </div>

      <div className="flex justify-center">
        <IconButton
          icon={
            isLoading ? (
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
              setRefetch({
                value: true,
              });
            }
          }}
        />
      </div>
    </div>
  );
}

export default memo(ForgotPasswordForm);
