import { RequestInit } from '@apis/api.type';
import apis from '@apis/index';
import AvatarUploader from '@components/AvatarUploader';
import Button from '@components/Button';
import Input from '@components/Input';
import LoadingWrapper from '@components/LoadingWrapper';
import MenuItem from '@components/MenuItem';
import Select from '@components/Select';
import { Gender } from '@constants/user.constants';
import { UserStatus } from '@constants/user.constants';
import authFeature from '@features/auth';
import themeFeature from '@features/theme';
import useFetch from '@hooks/fetch.hook';
import { useAppDispatch, useAppSelector } from '@hooks/redux.hook';
import UrlUtils from '@utilities/url.util';
import moment from 'moment';
import { memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { InputData, InputError } from './PersonalProfileForm.type';
import { useFormValidation } from '@hooks/validate.hook';
import { generateValidateSchema } from './PersonalProfileForm.schema';
import ErrorMessage from '@components/ErrorMessage';
import toastFeature from '@features/toast';
import { ToastType } from '@constants/toast.constants';

function PersonalProfileForm() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const themeValue = useAppSelector(themeFeature.themeSelector.selectValue);
  const profile = useAppSelector(authFeature.authSelector.selectUser);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [getPreUploadUrlRequest, setGetPreUploadUrlRequest] =
    useState<RequestInit>();
  const {
    data: getPreUploadAvatarUrlResData,
    isLoading: isGetingPreUploadAvatarUrl,
    setRefetch: setReGetPreUploadAvatarUrl,
  } = useFetch(apis.uploadApi.getUploadUrl, getPreUploadUrlRequest, false);
  const [uploadAvatarRequest, setUploadAvatarRequest] = useState<RequestInit>();
  const { setRefetch: setReUploadAvatar } = useFetch(
    apis.uploadApi.upload,
    uploadAvatarRequest,
    false
  );
  const [inputDataInit, setInputDataInit] = useState<InputData>({
    name: '',
    dob: undefined,
    gender: '-1',
    phone: '',
  });
  const [inputData, setInputData] = useState<InputData>(inputDataInit);
  const { values, handleChange, errors, validateAll } = useFormValidation<
    InputData,
    InputError
  >(inputData, generateValidateSchema());
  const [updateProfileReq, setUpdateProfileReq] = useState<RequestInit>();
  const {
    data: updateProfileResData,
    isLoading: isUpdatingProfile,
    error: updateProfileError,
    setRefetch: setReUpdateProfile,
  } = useFetch(apis.userApi.updateProfile, updateProfileReq, false);

  useEffect(() => {
    if (avatarFile) {
      setGetPreUploadUrlRequest({
        queries: {
          fileType: avatarFile.type,
        },
      });
    }
  }, [avatarFile]);

  useEffect(() => {
    if (getPreUploadUrlRequest) {
      setReGetPreUploadAvatarUrl({
        value: true,
      });
    }
  }, [getPreUploadUrlRequest]);

  useEffect(() => {
    if (!isGetingPreUploadAvatarUrl) {
      if (getPreUploadAvatarUrlResData) {
        setUploadAvatarRequest({
          uri: getPreUploadAvatarUrlResData.preUploadUrl,
          body: avatarFile,
          headers: {
            'Content-Type': avatarFile?.type || '',
          },
        });
      }
    }
  }, [isGetingPreUploadAvatarUrl]);

  useEffect(() => {
    if (uploadAvatarRequest) {
      setReUploadAvatar({
        value: true,
      });
    }
  }, [uploadAvatarRequest]);

  useEffect(() => {
    if (profile) {
      setInputDataInit({
        name: profile.name,
        dob:
          profile.dob !== null
            ? moment(profile.dob).format('YYYY-MM-DD')
            : undefined,
        gender: profile.gender !== null ? profile.gender : '-1',
        phone: profile.phone !== null ? profile.phone : '',
      });
    }
  }, [profile]);

  useEffect(() => {
    if (inputDataInit) {
      setInputData(inputDataInit);
    }
  }, [inputDataInit]);

  useEffect(() => {
    if (updateProfileReq) {
      setReUpdateProfile({
        value: true,
      });
    }
  }, [updateProfileReq]);

  useEffect(() => {
    if (!isUpdatingProfile) {
      if (updateProfileResData !== null) {
        dispatch(
          toastFeature.toastAction.add({
            type: ToastType.SUCCESS,
            title: t('notification.updateProfileSuccess'),
          })
        );
        dispatch(authFeature.authThunk.getProfile());
      } else {
        if (updateProfileError) {
          dispatch(
            toastFeature.toastAction.add({
              type: ToastType.ERROR,
              title: t('notification.updateProfileFailed'),
            })
          );
        }
      }
    }
  }, [isUpdatingProfile]);

  return (
    <LoadingWrapper
      isLoading={isUpdatingProfile}
      message={t(
        'reader.personalProfilePage.personalProfileForm.loading.updatingProfile.message'
      )}
    >
      <LoadingWrapper
        isLoading={!profile}
        message={t(
          'reader.personalProfilePage.personalProfileForm.loading.loadingProfileInfo.message'
        )}
        level="component"
      >
        <div className="px-6 py-8 space-y-8">
          <div>
            <AvatarUploader
              theme="rounded"
              previewUrl={
                profile?.avatar !== null
                  ? UrlUtils.generateUrl(profile?.avatar)
                  : undefined
              }
              value={avatarFile}
              onChange={(file) => setAvatarFile(file)}
            />
          </div>

          <div className="space-y-4 select-none">
            <h3 className="text-[1.2rem] font-[500]">
              {t(
                'reader.personalProfilePage.personalProfileForm.accountInfoSection.heading'
              )}
            </h3>

            <div className="grid desktop:grid-cols-2 tablet:grid-cols-2 mobile:grid-cols-1 gap-4">
              <div className="flex items-center justify-between">
                <div className="w-[92px]">
                  {t(
                    'reader.personalProfilePage.personalProfileForm.accountInfoSection.id'
                  )}
                </div>

                <div className="grow">
                  <Input
                    type="text"
                    placeholder={t(
                      'reader.personalProfilePage.personalProfileForm.accountInfoSection.id'
                    )}
                    readOnly
                    value={profile?.id}
                    sx={{
                      backgroundColor:
                        themeValue === 'light' ? 'var(--white)' : 'var(--dark)',
                      borderRadius: '4px',
                    }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="w-[92px]">
                  {t(
                    'reader.personalProfilePage.personalProfileForm.accountInfoSection.createdAt'
                  )}
                </div>

                <div className="grow">
                  <Input
                    type="text"
                    placeholder={t(
                      'reader.personalProfilePage.personalProfileForm.accountInfoSection.createdAt'
                    )}
                    readOnly
                    value={moment(profile?.user.createdAt).format('DD/MM/YYYY')}
                    sx={{
                      backgroundColor:
                        themeValue === 'light' ? 'var(--white)' : 'var(--dark)',
                      borderRadius: '4px',
                    }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="w-[92px]">
                  {t(
                    'reader.personalProfilePage.personalProfileForm.accountInfoSection.status.label'
                  )}
                </div>

                <div className="grow">
                  <Input
                    type="text"
                    placeholder={t(
                      'reader.personalProfilePage.personalProfileForm.accountInfoSection.status.label'
                    )}
                    readOnly
                    value={
                      profile?.user.status === UserStatus.UNACTIVATED
                        ? t(
                            'reader.personalProfilePage.personalProfileForm.accountInfoSection.status.unactivated'
                          )
                        : profile?.user.status === UserStatus.ACTIVATED
                          ? t(
                              'reader.personalProfilePage.personalProfileForm.accountInfoSection.status.activated'
                            )
                          : profile?.user.status === UserStatus.LOCKED
                            ? t(
                                'reader.personalProfilePage.personalProfileForm.accountInfoSection.status.locked'
                              )
                            : t(
                                'reader.personalProfilePage.personalProfileForm.accountInfoSection.status.deleted'
                              )
                    }
                    sx={{
                      backgroundColor:
                        themeValue === 'light' ? 'var(--white)' : 'var(--dark)',
                      borderRadius: '4px',
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-[1.2rem] font-[500]">
              {t(
                'reader.personalProfilePage.personalProfileForm.userInfoSection.heading'
              )}
            </h3>

            <div className="grid desktop:grid-cols-2 tablet:grid-cols-2 mobile:grid-cols-1 gap-4">
              <div className="flex justify-between">
                <div className="w-[92px] h-[40px] flex items-center">
                  {t(
                    'reader.personalProfilePage.personalProfileForm.userInfoSection.name'
                  )}
                </div>

                <div className="grow">
                  <Input
                    type="text"
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    placeholder={t(
                      'reader.personalProfilePage.personalProfileForm.userInfoSection.name'
                    )}
                    sx={{
                      backgroundColor:
                        themeValue === 'light' ? 'var(--white)' : 'var(--dark)',
                      borderRadius: '4px',
                    }}
                  />
                  {errors.name && <ErrorMessage message={errors.name} />}
                </div>
              </div>

              <div className="flex justify-between">
                <div className="w-[92px] h-[40px] flex items-center">
                  {t(
                    'reader.personalProfilePage.personalProfileForm.userInfoSection.dob'
                  )}
                </div>

                <div className="grow">
                  <Input
                    type="date"
                    name="dob"
                    value={values.dob}
                    onChange={handleChange}
                    placeholder={t(
                      'reader.personalProfilePage.personalProfileForm.userInfoSection.dob'
                    )}
                    sx={{
                      backgroundColor:
                        themeValue === 'light' ? 'var(--white)' : 'var(--dark)',
                      borderRadius: '4px',
                    }}
                  />
                  {errors.dob && <ErrorMessage message={errors.dob} />}
                </div>
              </div>

              <div className="flex justify-between">
                <div className="w-[92px] h-[40px] flex items-center">
                  {t(
                    'reader.personalProfilePage.personalProfileForm.userInfoSection.gender.label'
                  )}
                </div>

                <div className="grow">
                  <Select
                    name="gender"
                    value={values.gender}
                    onChange={handleChange}
                    sx={{
                      backgroundColor:
                        themeValue === 'light' ? 'var(--white)' : 'var(--dark)',
                    }}
                  >
                    <MenuItem value="-1" disabled>
                      {t(
                        'reader.personalProfilePage.personalProfileForm.userInfoSection.gender.label'
                      )}
                    </MenuItem>

                    <MenuItem value={Gender.MALE}>
                      {t(
                        'reader.personalProfilePage.personalProfileForm.userInfoSection.gender.male'
                      )}
                    </MenuItem>

                    <MenuItem value={Gender.FEMALE}>
                      {t(
                        'reader.personalProfilePage.personalProfileForm.userInfoSection.gender.female'
                      )}
                    </MenuItem>

                    <MenuItem value={Gender.ORTHER}>
                      {t(
                        'reader.personalProfilePage.personalProfileForm.userInfoSection.gender.orther'
                      )}
                    </MenuItem>
                  </Select>
                  {errors.gender && <ErrorMessage message={errors.gender} />}
                </div>
              </div>

              <div className="flex justify-between">
                <div className="w-[92px] h-[40px] flex items-center">
                  {t(
                    'reader.personalProfilePage.personalProfileForm.userInfoSection.phone'
                  )}
                </div>

                <div className="grow space-y-1 self-start">
                  <Input
                    type="text"
                    name="phone"
                    value={values.phone}
                    onChange={handleChange}
                    placeholder={t(
                      'reader.personalProfilePage.personalProfileForm.userInfoSection.phone'
                    )}
                    sx={{
                      backgroundColor:
                        themeValue === 'light' ? 'var(--white)' : 'var(--dark)',
                      borderRadius: '4px',
                    }}
                  />
                  {errors.phone && <ErrorMessage message={errors.phone} />}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 desktop:justify-start tablet:justify-center mobile:justify-center">
            <Button
              onClick={async () => {
                if (await validateAll()) {
                  setUpdateProfileReq({
                    body: {
                      ...values,
                      gender:
                        values.gender === '-1' ? undefined : values.gender,
                      phone: values.phone == '' ? undefined : values.phone,
                      avatar:
                        avatarFile !== null
                          ? getPreUploadAvatarUrlResData?.fileKey
                          : undefined,
                    },
                  });
                }
              }}
            >
              {t('reader.personalProfilePage.personalProfileForm.submitBtn')}
            </Button>

            <Button
              onClick={() => {
                setAvatarFile(() => null);
                setInputDataInit({
                  ...inputDataInit,
                });
              }}
              bgColor="red"
            >
              {t('reader.personalProfilePage.personalProfileForm.resetBtn')}
            </Button>
          </div>
        </div>
      </LoadingWrapper>
    </LoadingWrapper>
  );
}

export default memo(PersonalProfileForm);
