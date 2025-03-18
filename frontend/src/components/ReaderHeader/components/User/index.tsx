import { memo, useEffect, useRef, useState } from 'react';
import DefaultAvatar from '@assets/avatars/user-default.png';
import IconButton from '@components/IconButton';
import classNames from 'classnames';
import { useAppDispatch, useAppSelector } from '@hooks/redux.hook';
import themeFeature from '@features/theme';
import { Link, useNavigate } from 'react-router-dom';
import useFetch from '@hooks/fetch.hook';
import apis from '@apis/index';
import UserSkeleton from './UserSkeleton';
import authFeature from '@features/auth';
import UrlUtils from '@utilities/url.util';
import paths from '@routers/router.path';
import { TOKEN_KEY } from '@constants/auth.constants';
import LoadingWrapper from '@components/LoadingWrapper';

function User() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const themeValue = useAppSelector(themeFeature.themeSelector.selectValue);
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
  } = useFetch(
    apis.authApi.signOut,
    { body: JSON.parse(localStorage.getItem(TOKEN_KEY) as string) },
    false
  );

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
    if (isSignedOut !== null && isSignedOut != false) {
      dispatch(authFeature.authAction.signOut());
      navigate(paths.readerHomePage());
    }
  }, [isSignedOut]);

  if (isGettingProfile || !profile) {
    return <UserSkeleton />;
  }

  return (
    <LoadingWrapper isLoading={isSigningOut}>
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
                  className="w-6 h-6 object-cover object-center"
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
                  className="w-4 h-4 object-cover object-center"
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
              'absolute top-[calc(100%+14px)] right-0 min-w-80 rounded-[4px] p-2 leading-none animate-fadeIn',
              themeValue === 'light'
                ? ['light__boxShadow', 'light__bg']
                : ['dark__boxShadow', 'dark__bg']
            )}
          >
            <li>
              <Link
                className="py-4 space-x-2 hover:bg-[var(--primary)] hover:text-[var(--white)] px-4 flex items-center"
                to="#"
              >
                <span className="text-[1.6rem]">
                  <i className="fa-solid fa-wallet"></i>
                </span>

                <span>Ví tiền</span>
              </Link>
            </li>

            <li>
              <Link
                className="py-4 space-x-2 hover:bg-[var(--primary)] hover:text-[var(--white)] px-4 flex items-center"
                to="#"
              >
                <span className="text-[1.6rem]">
                  <i className="fa-solid fa-heart"></i>
                </span>
                <span>Truyện theo dõi</span>
              </Link>
            </li>

            <li>
              <Link
                className="py-4 space-x-2 hover:bg-[var(--primary)] hover:text-[var(--white)] px-4 flex items-center"
                to="#"
              >
                <span className="text-[1.6rem]">
                  <i className="fa-solid fa-check-to-slot"></i>
                </span>
                <span>Lịch sử đọc</span>
              </Link>
            </li>

            <li>
              <Link
                className="py-4 space-x-2 hover:bg-[var(--primary)] hover:text-[var(--white)] px-4 flex items-center"
                to="#"
              >
                <span className="text-[1.6rem]">
                  <i className="fa-solid fa-gear"></i>
                </span>
                <span>Cài đặt</span>
              </Link>
            </li>

            <li>
              <div
                className="py-4 space-x-2 hover:bg-[var(--primary)] hover:text-[var(--white)] px-4 flex items-center"
                onClick={() =>
                  setSignOut({
                    value: true,
                  })
                }
              >
                <span className="text-[1.6rem]">
                  <i className="fa-solid fa-right-from-bracket"></i>
                </span>
                <span>Đăng xuất</span>
              </div>
            </li>
          </ul>
        )}
      </div>
    </LoadingWrapper>
  );
}

export default memo(User);
