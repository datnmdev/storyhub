import InputWithIcon from '@components/InputWithIcon';
import { memo, useEffect } from 'react';
import KeyIcon from '@assets/icons/static/key.png';
import ErrorMessage from '@components/ErrorMessage';
import IconButton from '@components/IconButton';
import LoadingIcon from '@assets/icons/gifs/loading.gif';
import { Location, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useFormValidation } from '@hooks/validate.hook';
import { InputData, InputError } from './ResetPasswordForm.type';
import { generateValidateSchema } from './ResetPasswordForm.schema';
import useFetch from '@hooks/fetch.hook';
import apis from '@apis/index';
import { ForgotPasswordResponseData } from '@pages/OtpVerificationPage/components/OtpVerificationForm/OtpVerificationForm.type';
import { useAppDispatch } from '@hooks/redux.hook';
import toastFeature from '@features/toast';
import { ToastType } from '@constants/toast.constants';
import paths from '@routers/router.path';

function ResetPasswordForm() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location: Location<ForgotPasswordResponseData> = useLocation();
  const { t } = useTranslation();
  const { values, handleChange, errors, validateAll } = useFormValidation<
    InputData,
    InputError
  >(
    {
      password: '',
      repeatPassword: '',
    },
    generateValidateSchema()
  );
  const { data, isLoading, error, setRefetch } = useFetch<boolean>(
    apis.authApi.resetPassword,
    {
      body: {
        accountId: location.state?.accountId,
        state: location.state?.state,
        newPassword: values.password,
      },
    },
    false
  );

  useEffect(() => {
    if (data) {
      dispatch(
        toastFeature.toastAction.add({
          type: ToastType.SUCCESS,
          title: t('notification.resetPasswordSuccess'),
        })
      );
      navigate(paths.signInPage());
    } else {
      if (data !== null) {
        dispatch(
          toastFeature.toastAction.add({
            type: ToastType.ERROR,
            title: t('notification.resetPasswordFailed'),
          })
        );
      }
    }
  }, [data]);

  return (
    <div>
      {error && (
        <div className="bg-red-500 text-white p-4 rounded-[4px] animate-fadeIn">
          {t('notification.undefinedError')}
        </div>
      )}

      <div className="space-y-2">
        <div>
          <InputWithIcon
            name="password"
            type="password"
            icon={
              <img
                className="mx-auto"
                width={22}
                src={KeyIcon}
                alt="Key Icon"
              />
            }
            placeholder={t('reader.resetPasswordPage.password')}
            value={values.password}
            onChange={handleChange}
          />
          {errors.password && <ErrorMessage message={errors.password} />}
        </div>

        <div>
          <InputWithIcon
            name="repeatPassword"
            type="password"
            icon={<i className="fa-solid fa-repeat"></i>}
            placeholder={t('reader.resetPasswordPage.repeatPassword')}
            value={values.repeatPassword}
            onChange={handleChange}
          />
          {errors.repeatPassword && (
            <ErrorMessage message={errors.repeatPassword} />
          )}
        </div>
      </div>

      <div className="flex justify-center mt-4">
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

export default memo(ResetPasswordForm);
