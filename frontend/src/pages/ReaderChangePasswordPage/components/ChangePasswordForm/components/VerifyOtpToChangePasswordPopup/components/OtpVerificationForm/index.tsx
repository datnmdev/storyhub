import ErrorMessage from '@components/ErrorMessage';
import IconButton from '@components/IconButton';
import InputWithIcon from '@components/InputWithIcon';
import { memo, useEffect, useState } from 'react';
import LoadingIcon from '@assets/icons/gifs/loading.gif';
import { useTranslation } from 'react-i18next';
import { useFormValidation } from '@hooks/validate.hook';
import { generateValidateSchema } from './OtpVerificationForm.schema';
import {
  InputData,
  InputError,
  OtpVerificationFormProps,
} from './OtpVerificationForm.type';
import useFetch from '@hooks/fetch.hook';
import apis from '@apis/index';
import { useAppDispatch } from '@hooks/redux.hook';
import { RequestInit } from '@apis/api.type';
import toastFeature from '@features/toast';
import { ToastType } from '@constants/toast.constants';

function OtpVerificationForm({ data, onClose }: OtpVerificationFormProps) {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const [defaultInputData] = useState({
    otp: '',
  });
  const { values, handleChange, errors, validateAll } = useFormValidation<
    InputData,
    InputError
  >(defaultInputData, generateValidateSchema());
  const [changePasswordReq, setChangePasswordReq] = useState<RequestInit>();
  const {
    data: isChangedPassword,
    isLoading: isChangingPassword,
    error: changePasswordError,
    setRefetch: setReChangePassword,
  } = useFetch<boolean>(apis.authApi.changePassword, changePasswordReq, false);

  useEffect(() => {
    if (changePasswordReq) {
      setReChangePassword({
        value: true,
      });
    }
  }, [changePasswordReq]);

  useEffect(() => {
    if (!isChangingPassword) {
      if (isChangedPassword) {
        dispatch(
          toastFeature.toastAction.add({
            type: ToastType.SUCCESS,
            title: t('notification.changePasswordSuccess'),
          })
        );
        if (onClose) {
          onClose(null);
        }
      } else {
        if (changePasswordError) {
          dispatch(
            toastFeature.toastAction.add({
              type: ToastType.ERROR,
              title: t('notification.changePasswordFailed'),
            })
          );
          if (onClose) {
            onClose(null);
          }
        }
      }
    }
  }, [isChangingPassword]);

  return (
    <div className="space-y-4">
      {changePasswordError ? (
        <div className="bg-red-500 text-white p-4 rounded-[4px] animate-fadeIn">
          {t('notification.undefinedError')}
        </div>
      ) : null}
      {isChangedPassword === false ? (
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
            isChangingPassword ? (
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
              setChangePasswordReq({
                body: {
                  otp: values.otp,
                  newPassword: data.newPassword,
                },
              });
            }
          }}
        />
      </div>
    </div>
  );
}

export default memo(OtpVerificationForm);
