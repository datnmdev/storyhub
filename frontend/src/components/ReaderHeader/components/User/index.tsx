import { memo, useEffect, useRef, useState } from 'react';
import DefaultAvatar from '@assets/avatars/user-default.png';
import IconButton from '@components/IconButton';
import classNames from 'classnames';
import { useAppDispatch, useAppSelector } from '@hooks/redux.hook';
import themeFeature from '@features/theme';
import { Link, useNavigate } from 'react-router-dom';
import useFetch from '@hooks/fetch.hook';
import apis from '@apis/index';
import UserSkeleton from './User.skeleton';
import authFeature from '@features/auth';
import paths from '@routers/router.path';
import LoadingWrapper from '@components/LoadingWrapper';
import { useTranslation } from 'react-i18next';
import UrlUtils from '@utilities/url.util';
import socketFeature from '@features/socket';
import notificationFeature from '@features/notification';

function User() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const themeValue = useAppSelector(themeFeature.themeSelector.selectValue);
  const allUnSeenNotifications = useAppSelector(
    notificationFeature.notificationSelector.selectAllUnSeenNotifications
  );
  const [hiddenBox, setHiddenBox] = useState<boolean>(true);
  const boxRef = useRef<HTMLUListElement | null>(null);
  const { data: profileData, isLoading: isGettingProfile } = useFetch(
    apis.userApi.getProfile
  );
  const profile = useAppSelector(authFeature.authSelector.selectUser);
  const {
    data: isSignedOut,
    isLoading: isSigningOut,
    setRefetch: setSignOut,
  } = useFetch(apis.authApi.signOut, {}, false);

  const handleClickOutside = (e: MouseEvent) => {
    if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
      setHiddenBox(true);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (profileData !== null) {
      dispatch(authFeature.authAction.setUser(profileData));
    }
  }, [profileData]);

  useEffect(() => {
    if (isSignedOut !== null) {
      dispatch(authFeature.authAction.signOut());
      navigate(paths.readerHomePage());
    }
  }, [isSignedOut]);

  if (isGettingProfile || !profile) {
    return <UserSkeleton />;
  }

  return (
    <LoadingWrapper
      isLoading={isSigningOut}
      message={t('reader.header.signingOut')}
    >
      <div className="relative">
        <div
          className="border-[2px] border-solid rounded-[50%] border-[var(--gray)]"
          onClick={() => setHiddenBox(!hiddenBox)}
        >
          {/* Desktop */}
          <div className="desktop:block tablet:hidden mobile:hidden">
            <IconButton
              icon={
                <img
                  className="w-8 h-8 object-cover object-center rounded-[50%]"
                  src={
                    profile.avatar
                      ? UrlUtils.generateUrl(profile.avatar)
                      : DefaultAvatar
                  }
                  alt="Avatar"
                />
              }
              width={32}
              height={32}
              borderRadius="50%"
            />
          </div>

          {/* Mobile & Tablet */}
          <div className="desktop:hidden tablet:block mobile:block">
            <IconButton
              icon={
                <img
                  className="w-5 h-5 object-cover object-center rounded-[50%]"
                  src={
                    profile.avatar
                      ? UrlUtils.generateUrl(profile.avatar)
                      : DefaultAvatar
                  }
                  alt="Avatar"
                />
              }
              width={20}
              height={20}
              borderRadius="50%"
            />
          </div>
        </div>

        {!hiddenBox && (
          <ul
            ref={boxRef}
            className={classNames(
              'absolute top-[calc(100%+14px)] right-0 min-w-80 rounded-[4px] p-2 leading-none animate-fadeIn z-[2]',
              themeValue === 'light'
                ? ['light__boxShadow', 'light__bg']
                : ['dark__boxShadow', 'dark__bg']
            )}
          >
            <li>
              <Link
                className="py-4 space-x-2 hover:bg-[var(--primary)] hover:text-[var(--white)] px-4 flex items-center justify-between"
                to={paths.readerNotificationPage()}
                onClick={() => setHiddenBox(true)}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-[1.6rem]">
                    <i className="fa-solid fa-bell"></i>
                  </span>

                  <span>{t('reader.header.user.notification')}</span>
                </div>

                <span className="h-6 min-w-8 rounded-[4px] bg-red-500 text-white flex justify-center items-center">
                  {allUnSeenNotifications.total > 99
                    ? '99+'
                    : allUnSeenNotifications.total}
                </span>
              </Link>
            </li>

            <li>
              <Link
                className="py-4 space-x-2 hover:bg-[var(--primary)] hover:text-[var(--white)] px-4 flex items-center"
                to={paths.readerWalletPage()}
                onClick={() => setHiddenBox(true)}
              >
                <span className="text-[1.6rem]">
                  <i className="fa-solid fa-wallet"></i>
                </span>

                <span>{t('reader.header.user.wallet')}</span>
              </Link>
            </li>

            <li>
              <Link
                className="py-4 space-x-2 hover:bg-[var(--primary)] hover:text-[var(--white)] px-4 flex items-center"
                to={paths.readerFollowManagementPage()}
                onClick={() => setHiddenBox(true)}
              >
                <span className="text-[1.6rem]">
                  <i className="fa-solid fa-heart"></i>
                </span>
                <span>{t('reader.header.user.follow')}</span>
              </Link>
            </li>

            <li>
              <Link
                className="py-4 space-x-2 hover:bg-[var(--primary)] hover:text-[var(--white)] px-4 flex items-center"
                to={paths.readerHistoryPage()}
                onClick={() => setHiddenBox(true)}
              >
                <span className="text-[1.6rem]">
                  <i className="fa-solid fa-check-to-slot"></i>
                </span>
                <span>{t('reader.header.user.history')}</span>
              </Link>
            </li>

            <li>
              <Link
                className="py-4 space-x-2 hover:bg-[var(--primary)] hover:text-[var(--white)] px-4 flex items-center"
                to={paths.readerPersonalProfilePage()}
                onClick={() => setHiddenBox(true)}
              >
                <span className="text-[1.6rem]">
                  <i className="fa-solid fa-gear"></i>
                </span>
                <span>{t('reader.header.user.setting')}</span>
              </Link>
            </li>

            <li>
              <div
                className="py-4 space-x-2 hover:bg-[var(--primary)] hover:text-[var(--white)] px-4 flex items-center"
                onClick={() => {
                  setHiddenBox(true);
                  setSignOut({
                    value: true,
                  });
                  dispatch(
                    socketFeature.socketAction.setCreateNewConnection({
                      isCreateNewConnection: true,
                    })
                  );
                }}
              >
                <span className="text-[1.6rem]">
                  <i className="fa-solid fa-right-from-bracket"></i>
                </span>
                <span>{t('reader.header.user.signOut')}</span>
              </div>
            </li>
          </ul>
        )}
      </div>
    </LoadingWrapper>
  );
}

export default memo(User);
