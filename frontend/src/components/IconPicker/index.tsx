import { memo, useEffect, useRef, useState } from 'react';
import { IconBoxProps, IconSubject } from './IconPicker.type';
import classNames from 'classnames';
import { useAppSelector } from '@hooks/redux.hook';
import themeFeature from '@features/theme';

function IconPicker({
  activatedIcon = <i className="fa-solid fa-face-smile"></i>,
  unactivatedIcon = <i className="fa-regular fa-face-smile"></i>,
  data,
  fontSize = 24,
  onClickedItem,
}: IconBoxProps) {
  const themeValue = useAppSelector(themeFeature.themeSelector.selectValue);
  const [isOpen, setOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<IconSubject>(data[0]);
  const containerRef = useRef<HTMLDivElement>(null);
  const iconBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickedOutside(this: Window, e: any) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }

    window.addEventListener('click', handleClickedOutside);

    return () => {
      removeEventListener('click', handleClickedOutside);
    };
  }, []);

  useEffect(() => {
    if (containerRef.current && iconBoxRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      if (window.innerWidth < 740) {
        iconBoxRef.current.style.left = `${-containerRect.left + 24}px`;
        iconBoxRef.current.style.width = `${window.innerWidth - 48}px`;
      }
    }
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative inline-block z-[2]">
      <div
        className="w-[32px] h-[32px] flex justify-center items-center text-[1.2rem] cursor-pointer hover:bg-[var(--gray)] rounded-full transition-colors duration-300"
        onClick={() => setOpen(!isOpen)}
      >
        {isOpen ? (
          <span className="text-[var(--primary)]">{activatedIcon}</span>
        ) : (
          <span>{unactivatedIcon}</span>
        )}
      </div>

      <div
        ref={iconBoxRef}
        className={classNames(
          'absolute top-[calc(100%+8px)] left-0 flex flex-col item min-w-[320px] rounded-[4px] overflow-hidden animate-fadeIn',
          themeValue === 'light'
            ? 'light light__boxShadow'
            : 'dark dark__boxShadow'
        )}
        style={{
          display: isOpen ? 'flex' : 'none',
        }}
      >
        <div className="py-4 px-2 overflow-hidden">
          <div className="text-[0.9rem] text-[var(--dark-gray)] mb-2">
            {selectedSubject.title}
          </div>

          <div className="h-[220px] flex items-start flex-wrap overflow-auto">
            {selectedSubject.data.map((item, index) => {
              return (
                <span
                  key={index}
                  className={classNames(
                    'p-1 rounded-full cursor-pointer flex items-center justify-center'
                  )}
                >
                  <img
                    className="object-cover object-center"
                    width={fontSize}
                    height={fontSize}
                    src={item}
                    alt="Icon"
                    onClick={() => {
                      if (onClickedItem) {
                        const imgElement = document.createElement('img');
                        imgElement.className =
                          'inline-block object-cover object-center';
                        imgElement.width = fontSize;
                        imgElement.height = fontSize;
                        imgElement.src = item;
                        imgElement.alt = 'Icon';
                        onClickedItem(imgElement);
                      }
                    }}
                  />
                </span>
              );
            })}
          </div>
        </div>

        <div className="grow flex items-center p-2 bg-inherit border-t-[1px] border-solid border-[var(--gray)]">
          {data.map((item, index) => {
            return (
              <span
                key={index}
                className={classNames(
                  'p-1 rounded-full hover:bg-[var(--primary)] cursor-pointer',
                  selectedSubject.title === item.title
                    ? 'bg-[var(--primary)]'
                    : ''
                )}
              >
                <img
                  className="w-6 h-6 object-cover object-center shrink-0 rounded-full"
                  src={item.icon}
                  alt={item.title}
                  onClick={() => setSelectedSubject(item)}
                />
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default memo(IconPicker);
