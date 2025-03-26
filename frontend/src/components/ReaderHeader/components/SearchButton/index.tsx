import IconButton from '@components/IconButton';
import DarkSearchIcon from '@assets/icons/static/dark-search.png';
import LightSearchIcon from '@assets/icons/static/light-search.png';
import { useSelector } from 'react-redux';
import themeFeature from '@features/theme';
import { memo, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import Item from './components/Item';
import useFetch from '@hooks/fetch.hook';
import apis from '@apis/index';
import { RequestInit } from '@apis/api.type';

function SearchButton() {
  const { t } = useTranslation();
  const themeValue = useSelector(themeFeature.themeSelector.selectValue);

  const [isOpen, setOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const [isShrinking, setShrinking] = useState(false);
  const [requestInit, setRequestInit] = useState<RequestInit>();
  const { data, setRefetch } = useFetch(
    apis.storyApi.search,
    requestInit,
    false
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const searchBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && searchBoxRef.current) {
      const searchBox = searchBoxRef.current;
      if (!isOpen) {
        searchBox.classList.remove('slide-right-show');
        searchBox.classList.add('slide-right-hide');
      } else {
        searchBox.classList.remove('slide-right-hide');
        searchBox.classList.add('slide-right-show');
      }
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      if (searchRef.current) {
        searchRef.current.focus();
      }
    }
  }, [isOpen]);

  useEffect(() => {
    if (requestInit) {
      setRefetch({
        value: true,
      });
    }
  }, [requestInit]);

  useEffect(() => {
    const handleClickedOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setShrinking(true);
        setTimeout(() => {
          setOpen(false);
          setShrinking(false);
        }, 900);
      }
    };

    document.addEventListener('mousedown', handleClickedOutside);

    return () => {
      removeEventListener('click', handleClickedOutside);
    };
  }, []);

  return (
    <div ref={containerRef} className="flex items-center justify-end">
      {isOpen && (
        <>
          <div className="desktop:flex tablet:flex mobile:hidden relative leading-none min-w-[320px] max-w-full justify-end">
            <input
              ref={searchRef}
              className={classNames(
                'block w-full border-[2px] border-solid border-[var(--gray)] px-4 py-2.5 rounded-[4px] focus:outline-[var(--primary)] bg-inherit text-inherit',
                !isShrinking ? 'animate-expandWidth' : 'animate-shrinkWidth'
              )}
              type="text"
              placeholder={t('reader.header.searchSection.placeholder')}
              onChange={(e) =>
                setRequestInit({
                  queries: {
                    keyword: e.target.value,
                  },
                })
              }
            />

            {data && (
              <div
                className={classNames(
                  'shrink-0 absolute top-full left-0 w-full space-y-2 mt-2 max-h-[420px] overflow-y-auto z-[1] rounded-[4px]',
                  themeValue === 'light'
                    ? 'light__boxShadow bg-[var(--white)]'
                    : 'dark__boxShadow bg-[var(--black)]'
                )}
              >
                <div
                  className={classNames(
                    'p-4 space-x-2 sticky top-0 left-0',
                    themeValue === 'light'
                      ? 'bg-[var(--white)]'
                      : 'bg-[var(--black)]'
                  )}
                >
                  <span className="font-[450]">
                    {t('reader.header.searchSection.resultTitle')}
                  </span>
                  <span className="text-[var(--primary)]">{data[1]}</span>
                </div>

                {data[0].map((story: any) => {
                  return <Item key={story.id} data={story} />;
                })}
              </div>
            )}
          </div>

          <div
            ref={searchBoxRef}
            className={classNames(
              'desktop:hidden tablet:hidden mobile:flex flex-col slide-animate fixed top-0 left-0 w-[100vw] h-[100vh] z-[1] pb-4 overflow-hidden',
              themeValue === 'light'
                ? 'light light__boxShadow'
                : 'dark dark__boxShadow'
            )}
          >
            <div className="shrink-0">
              <div className="flex justify-between items-center p-4">
                <h3 className="font-[450] text-[1.2rem]">
                  Tìm kiếm truyện theo từ khoá
                </h3>
                <IconButton
                  icon={<i className="fa-solid fa-times"></i>}
                  fontSize="1.6rem"
                  onClick={() => setOpen(false)}
                />
              </div>
            </div>

            <div className="grow leading-none max-w-full flex flex-col mx-4 overflow-hidden">
              <input
                className="block w-full border-[2px] border-solid border-[var(--gray)] px-4 py-2.5 rounded-[4px] focus:outline-[var(--primary)] bg-inherit text-inherit"
                type="text"
                placeholder={t('reader.header.searchSection.placeholder')}
                onChange={(e) =>
                  setRequestInit({
                    queries: {
                      keyword: e.target.value,
                    },
                  })
                }
              />

              {data && (
                <div
                  className={classNames(
                    'grow relative w-full space-y-2 mt-2 overflow-y-auto z-[1] rounded-[4px]',
                    themeValue === 'light'
                      ? 'light__boxShadow bg-[var(--white)]'
                      : 'dark__boxShadow bg-[var(--black)]'
                  )}
                >
                  <div
                    className={classNames(
                      'p-4 space-x-2 sticky top-0 left-0',
                      themeValue === 'light'
                        ? 'bg-[var(--white)]'
                        : 'bg-[var(--black)]'
                    )}
                  >
                    <span className="font-[450]">
                      {t('reader.header.searchSection.resultTitle')}
                    </span>
                    <span className="text-[var(--primary)]">{data[1]}</span>
                  </div>

                  {data[0].map((story: any) => {
                    return <Item key={story.id} data={story} />;
                  })}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {!isOpen && (
        <IconButton
          icon={
            <img
              className="desktop:w-[28px] tablet:w-[19px] mobile:w-[19px] desktop:h-[28px] tablet:h-[19px] mobile:h-[19px] object-cover object-center"
              src={themeValue === 'light' ? LightSearchIcon : DarkSearchIcon}
            />
          }
          borderRadius="50%"
          onClick={() => setOpen(true)}
        />
      )}
    </div>
  );
}

export default memo(SearchButton);
