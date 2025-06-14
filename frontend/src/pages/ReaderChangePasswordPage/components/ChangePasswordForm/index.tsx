import { RequestInit } from '@apis/api.type';
import apis from '@apis/index';
import Button from '@components/Button';
import Input from '@components/Input';
import LoadingWrapper from '@components/LoadingWrapper';
import themeFeature from '@features/theme';
import useFetch from '@hooks/fetch.hook';
import { useAppSelector } from '@hooks/redux.hook';
import { memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormValidation } from '@hooks/validate.hook';
import { InputData, InputError } from './ChangePasswordForm.type';
import { generateValidateSchema } from './ChangePasswordForm.schema';
import ErrorMessage from '@components/ErrorMessage';
import VerifyOtpToChangePasswordPopup from './components/VerifyOtpToChangePasswordPopup';

function ChangePasswordForm() {
  const { t } = useTranslation();
  const themeValue = useAppSelector(themeFeature.themeSelector.selectValue);
  const [inputDataInit, setInputDataInit] = useState<InputData>({
    oldPassword: '',
    newPassword: '',
    repeatNewPassword: '',
  });
  const [inputData, setInputData] = useState<InputData>(inputDataInit);
  const { values, handleChange, errors, validateAll } = useFormValidation<
    InputData,
    InputError
  >(inputData, generateValidateSchema());
  const [verifyChangePasswordInfoReq, setVerifyChangePasswordInfoReq] =
    useState<RequestInit>();
  const {
    data: verifyChangePasswordInfoResData,
    isLoading: isVerifyingChangePasswordInfo,
    error: verifyChangePasswordInfoError,
    setRefetch: setReVerifyChangePasswordInfo,
  } = useFetch(
    apis.authApi.verifyChangePasswordInfo,
    verifyChangePasswordInfoReq,
    false
  );
  const [hiddenVerifyOtpPopup, setHiddenVerifyOtpPopup] = useState(true);

  useEffect(() => {
    if (inputDataInit) {
      setInputData(inputDataInit);
    }
  }, [inputDataInit]);

  useEffect(() => {
    if (verifyChangePasswordInfoReq) {
      setReVerifyChangePasswordInfo({
        value: true,
      });
    }
  }, [verifyChangePasswordInfoReq]);

  useEffect(() => {
    if (!isVerifyingChangePasswordInfo) {
      if (verifyChangePasswordInfoResData) {
        setHiddenVerifyOtpPopup(false);
      }
    }
  }, [isVerifyingChangePasswordInfo]);

  return (
    <LoadingWrapper
      isLoading={isVerifyingChangePasswordInfo}
      message={t(
        'reader.changePasswordPage.changePasswordForm.loading.verifyInfo.message'
      )}
    >
      <div className="px-6 py-8 space-y-8">
        {(verifyChangePasswordInfoError ||
          verifyChangePasswordInfoResData === false) && (
          <div className="bg-red-500 text-white p-4 rounded-[4px] animate-fadeIn">
            {t('notification.verifyChangePasswordFailed')}
          </div>
        )}

        <div className="space-y-4">
          <div className="max-w-[560px] flex desktop:flex-row tablet:flex-row mobile:flex-col justify-between">
            <div className="w-[180px] h-[40px] flex items-center shrink-0">
              {t(
                'reader.changePasswordPage.changePasswordForm.oldPassword.label'
              )}
            </div>

            <div className="grow">
              <Input
                type="password"
                name="oldPassword"
                value={values.oldPassword}
                onChange={handleChange}
                placeholder={t(
                  'reader.changePasswordPage.changePasswordForm.oldPassword.placeholder'
                )}
                sx={{
                  backgroundColor:
                    themeValue === 'light' ? 'var(--white)' : 'var(--dark)',
                  borderRadius: '4px',
                }}
              />
              {errors.oldPassword && (
                <ErrorMessage message={errors.oldPassword} />
              )}
            </div>
          </div>

          <div className="max-w-[560px] flex desktop:flex-row tablet:flex-row mobile:flex-col justify-between">
            <div className="w-[180px] h-[40px] flex items-center shrink-0">
              {t(
                'reader.changePasswordPage.changePasswordForm.oldPassword.label'
              )}
            </div>

            <div className="grow">
              <Input
                type="password"
                name="newPassword"
                value={values.newPassword}
                onChange={handleChange}
                placeholder={t(
                  'reader.changePasswordPage.changePasswordForm.newPassword.placeholder'
                )}
                sx={{
                  backgroundColor:
                    themeValue === 'light' ? 'var(--white)' : 'var(--dark)',
                  borderRadius: '4px',
                }}
              />
              {errors.newPassword && (
                <ErrorMessage message={errors.newPassword} />
              )}
            </div>
          </div>

          <div className="max-w-[560px] flex desktop:flex-row tablet:flex-row mobile:flex-col justify-between">
            <div className="w-[180px] h-[40px] flex items-center shrink-0">
              {t(
                'reader.changePasswordPage.changePasswordForm.repeatNewPassword.label'
              )}
            </div>

            <div className="grow">
              <Input
                type="password"
                name="repeatNewPassword"
                value={values.repeatNewPassword}
                onChange={handleChange}
                placeholder={t(
                  'reader.changePasswordPage.changePasswordForm.repeatNewPassword.placeholder'
                )}
                sx={{
                  backgroundColor:
                    themeValue === 'light' ? 'var(--white)' : 'var(--dark)',
                  borderRadius: '4px',
                }}
              />
              {errors.repeatNewPassword && (
                <ErrorMessage message={errors.repeatNewPassword} />
              )}
            </div>
          </div>
        </div>

        <div className="flex desktop:justify-start tablet:justify-center mobile:justify-center space-x-2">
          <Button
            onClick={async () => {
              if (await validateAll()) {
                setVerifyChangePasswordInfoReq({
                  body: {
                    oldPassword: values.oldPassword,
                    newPassword: values.newPassword,
                  },
                });
              }
            }}
          >
            {t('reader.changePasswordPage.changePasswordForm.submitBtn')}
          </Button>

          <Button
            onClick={() =>
              setInputDataInit({
                ...inputDataInit,
              })
            }
            bgColor="red"
          >
            {t('reader.changePasswordPage.changePasswordForm.resetBtn')}
          </Button>
        </div>
      </div>

      {!hiddenVerifyOtpPopup && (
        <VerifyOtpToChangePasswordPopup
          data={verifyChangePasswordInfoResData}
          onClose={() => setHiddenVerifyOtpPopup(true)}
        />
      )}
    </LoadingWrapper>
  );
}

export default memo(ChangePasswordForm);
