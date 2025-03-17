import { memo, useEffect, useRef, useState } from 'react';
import DefaultAvatar from '@assets/avatars/user-default.png';
import IconButton from '@components/IconButton';
import classNames from 'classnames';
import { useAppDispatch, useAppSelector } from '@hooks/redux.hook';
import themeFeature from '@features/theme';
import { Link } from 'react-router-dom';
import useFetch from '@hooks/fetch.hook';
import apis from '@apis/index';
import UserSkeleton from './UserSkeleton';
import authFeature from '@features/auth';
import UrlUtils from '@utilities/url.util';

function User() {
  const dispatch = useAppDispatch();
  const themeValue = useAppSelector(themeFeature.themeSelector.selectValue);
  const [hiddenBox, setHiddenBox] = useState<boolean>(true);
  const boxRef = useRef<HTMLUListElement | null>(null);
  const { data, isLoading } = useFetch(apis.userApi.getProfile);
  const profile = useAppSelector(authFeature.authSelector.selectUser);

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
    if (data !== null) {
      dispatch(authFeature.authAction.setUser(data));
    }
  }, [data]);

  if (isLoading || !profile) {
    return <UserSkeleton />;
  }

  return (
    <div className="relative">
      <div
        className="border-[2px] border-solid rounded-[50%] border-[var(--gray)]"
        onClick={() => setHiddenBox(!hiddenBox)}
      >
        {/* Desktop */}
        <div className='desktop:block tablet:hidden mobile:hidden'>
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
        <div className='desktop:hidden tablet:block mobile:block'>
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
            <Link
              className="py-4 space-x-2 hover:bg-[var(--primary)] hover:text-[var(--white)] px-4 flex items-center"
              to="#"
            >
              <span className="text-[1.6rem]">
                <i className="fa-solid fa-right-from-bracket"></i>
              </span>
              <span>Đăng xuất</span>
            </Link>
          </li>
        </ul>
      )}
    </div>
  );
}

export default memo(User);
