import InputWithIcon from '@components/InputWithIcon';
import { memo, useEffect, useState } from 'react';
import KeyIcon from '@assets/icons/static/key.png';
import { useTranslation } from 'react-i18next';
import { Link, Location, useLocation, useNavigate } from 'react-router-dom';
import IconButton from '@components/IconButton';
import { useFormValidation } from './hooks/validate.hook';
import ErrorMessage from '@components/ErrorMessage';
import { generateValidateSchema } from './SignInWithEmailForm.schema';
import useFetch from '@hooks/fetch.hook';
import { Token } from '@features/auth/auth.type';
import apis from '@apis/index';
import LoadingIcon from '@assets/icons/gifs/loading.gif';
import { useAppDispatch } from '@hooks/redux.hook';
import authFeature from '@features/auth';
import toastFeature from '@features/toast';
import { ToastType } from '@constants/toast.constants';
import { LocationState } from '@type/reactRouterDom.type';
import paths from '@routers/router.path';
import { Role } from '@constants/user.constants';

function SignInWithEmailForm() {
  const dispatch = useAppDispatch();
  const location: Location<LocationState> = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { values, handleChange, errors, validateAll } = useFormValidation(
    {
      email: '',
      password: '',
    },
    generateValidateSchema()
  );
  const [isValid, setValid] = useState(false);
  const { data, isLoading, error, setRefetch } = useFetch<Token>(
    apis.authApi.signInWithEmailPassword,
    { body: values },
    false
  );

  useEffect(() => {
    async function callValidateAll() {
      setValid(await validateAll());
    }
    callValidateAll();
  }, [values]);

  useEffect(() => {
    if (data) {
      dispatch(authFeature.authAction.signIn());
      dispatch(
        toastFeature.toastAction.add({
          type: ToastType.SUCCESS,
          title: t('notification.loginSuccess'),
        })
      );
      navigate(`${paths.authRedirectPage()}?${new URLSearchParams({
        url: location.state.from || '/',
        role: location.state.role as Role
      }).toString()}`, {
        replace: true,
      });
    }
  }, [data]);

  return (
    <div className="space-y-2">
      {error && (
        <div className="bg-red-500 text-white p-4 rounded-[4px] animate-fadeIn">
          {t('notification.signInWithEmailPasswordFailure')}
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

      <div className="flex justify-end">
        <Link className="text-[var(--primary)] hover:opacity-60 py-1" to="#">
          {t('reader.signInPage.forgotPassword')}
        </Link>
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
          disable={!isValid}
          borderRadius="50%"
          onClick={() =>
            setRefetch({
              value: true,
            })
          }
        />
      </div>
    </div>
  );
}

export default memo(SignInWithEmailForm);
