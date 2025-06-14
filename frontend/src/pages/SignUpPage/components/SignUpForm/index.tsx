import InputWithIcon from '@components/InputWithIcon';
import { memo, useEffect, useState } from 'react';
import KeyIcon from '@assets/icons/static/key.png';
import { useTranslation } from 'react-i18next';
import IconButton from '@components/IconButton';
import ErrorMessage from '@components/ErrorMessage';
import { generateValidateSchema } from './SignUpForm.schema';
import useFetch from '@hooks/fetch.hook';
import apis from '@apis/index';
import LoadingIcon from '@assets/icons/gifs/loading.gif';
import { useFormValidation } from '@hooks/validate.hook';
import { Gender, OtpVerificationType, Role } from '@constants/user.constants';
import { InputData, InputError } from './SignUpForm.type';
import SelectWithIcon from '@components/SelectWithIcon';
import MenuItem from '@components/MenuItem';
import { useNavigate } from 'react-router-dom';
import paths from '@routers/router.path';
import moment from 'moment';
import { Country } from '@apis/country';
import { RequestInit } from '@apis/api.type';

function SignUpForm() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [defaultInputData] = useState({
    type: '-1',
    email: '',
    name: '',
    dob: undefined,
    gender: '-1',
    phone: '',
    password: '',
    repeatPassword: '',
    countryId: '-1',
  });
  const { values, handleChange, errors, validateAll } = useFormValidation<
    InputData,
    InputError
  >(defaultInputData, generateValidateSchema());
  const {
    data: isEmailExisted,
    isLoading: isValidatingEmail,
    setRefetch: setReValidateEmail,
  } = useFetch<boolean>(
    apis.authApi.validateEmail,
    { queries: { email: values.email } },
    false
  );
  const [signUpRequest, setSignUpRequest] = useState<RequestInit>();
  const {
    data: signUpResponseData,
    isLoading: isSigningUp,
    error: signUpError,
    setRefetch: setReSignUp,
  } = useFetch<boolean>(apis.authApi.signUp, signUpRequest, false);

  const { data: countriesData, isLoading: isGettingCountries } = useFetch<
    [Country[], number]
  >(apis.countryApi.getCountries, {
    queries: {
      page: 1,
      limit: Number.MAX_SAFE_INTEGER,
    },
  });

  useEffect(() => {
    if (values.email) {
      setReValidateEmail({
        value: true,
      });
    }
  }, [values.email]);

  useEffect(() => {
    if (signUpResponseData) {
      navigate(paths.otpVerificationPage(), {
        state: {
          type: OtpVerificationType.SIGN_UP,
          prevData: {
            email: values.email,
            password: values.password,
          },
          account: signUpResponseData,
        },
      });
    }
  }, [signUpResponseData]);

  return (
    <div className="space-y-2">
      {signUpError && (
        <div className="bg-red-500 text-white p-4 rounded-[4px] animate-fadeIn">
          {t('notification.undefinedError')}
        </div>
      )}

      <div>
        <SelectWithIcon
          icon={<i className="fa-regular fa-user"></i>}
          name="type"
          border="none"
          value={values.type}
          onChange={(e) => handleChange(e)}
        >
          <MenuItem value="-1" disabled>
            {t('reader.signUpPage.accountType.label')}
          </MenuItem>
          <MenuItem value={String(Role.READER)}>
            {t('reader.signUpPage.accountType.reader')}
          </MenuItem>
          <MenuItem value={String(Role.AUTHOR)}>
            {t('reader.signUpPage.accountType.author')}
          </MenuItem>
        </SelectWithIcon>
        {errors.type && <ErrorMessage message={errors.type} />}
      </div>

      <div>
        <InputWithIcon
          name="email"
          type="email"
          placeholder={t('reader.signUpPage.email')}
          value={values.email}
          onChange={handleChange}
        />
        {errors.email ? (
          <ErrorMessage message={errors.email} />
        ) : (
          !isValidatingEmail &&
          isEmailExisted && (
            <ErrorMessage message={t('validation.emailExisted')} />
          )
        )}
      </div>

      <div>
        <InputWithIcon
          icon={<i className="fa-solid fa-signature"></i>}
          name="name"
          type="text"
          placeholder={t('reader.signUpPage.name')}
          value={values.name}
          onChange={handleChange}
        />
        {errors.name && <ErrorMessage message={errors.name} />}
      </div>

      <div>
        <InputWithIcon
          icon={<i className="fa-solid fa-cake-candles"></i>}
          name="dob"
          type="text"
          placeholder={t('reader.signUpPage.dob')}
          value={values.dob}
          max={moment(Date.now(), 'YYYY-MM-DD').toString()}
          onChange={handleChange}
          onFocus={(e) => (e.target.type = 'date')}
          onBlur={(e) => (e.target.type = 'text')}
        />
        {errors.dob && <ErrorMessage message={errors.dob} />}
      </div>

      <div>
        <SelectWithIcon
          icon={<i className="fa-solid fa-venus-mars"></i>}
          name="gender"
          border="none"
          value={values.gender}
          onChange={(e) => handleChange(e)}
        >
          <MenuItem value="-1" disabled>
            {t('reader.signUpPage.gender.label')}
          </MenuItem>
          <MenuItem value={String(Gender.MALE)}>
            {t('reader.signUpPage.gender.male')}
          </MenuItem>
          <MenuItem value={String(Gender.FEMALE)}>
            {t('reader.signUpPage.gender.female')}
          </MenuItem>
          <MenuItem value={String(Gender.ORTHER)}>
            {t('reader.signUpPage.gender.other')}
          </MenuItem>
        </SelectWithIcon>
        {errors.gender && <ErrorMessage message={errors.gender} />}
      </div>

      <div>
        <InputWithIcon
          icon={<i className="fa-solid fa-phone"></i>}
          name="phone"
          type="text"
          placeholder={t('reader.signUpPage.phone')}
          value={values.phone}
          onChange={handleChange}
        />
        {errors.phone && <ErrorMessage message={errors.phone} />}
      </div>

      <div>
        <InputWithIcon
          name="password"
          type="password"
          icon={
            <img className="mx-auto" width={22} src={KeyIcon} alt="Key Icon" />
          }
          placeholder={t('reader.signInPage.password')}
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
          placeholder={t('reader.signUpPage.repeatPassword')}
          value={values.repeatPassword}
          onChange={handleChange}
        />
        {errors.repeatPassword && (
          <ErrorMessage message={errors.repeatPassword} />
        )}
      </div>

      <div>
        <SelectWithIcon
          icon={<i className="fa-solid fa-globe"></i>}
          key={1}
          name="countryId"
          border="none"
          value={values.countryId}
          onChange={(e) => handleChange(e)}
        >
          <MenuItem value="-1" disabled>
            {t('reader.signUpPage.country.label')}
          </MenuItem>
          {!isGettingCountries &&
            countriesData &&
            countriesData[0].map((country) => {
              return (
                <MenuItem key={country.id} value={String(country.id)}>
                  {country.name}
                </MenuItem>
              );
            })}
        </SelectWithIcon>
        {errors.countryId && <ErrorMessage message={errors.countryId} />}
      </div>

      <div className="flex justify-center">
        <IconButton
          icon={
            isSigningUp ? (
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
            if ((await validateAll()) && !isEmailExisted) {
              setSignUpRequest(() => ({
                body: {
                  ...values,
                },
              }));
              setReSignUp({
                value: true,
              });
            }
          }}
        />
      </div>
    </div>
  );
}

export default memo(SignUpForm);
