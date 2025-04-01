import authFeature from '@features/auth';
import { useAppSelector } from '@hooks/redux.hook';
import UrlUtils from '@utilities/url.util';
import {
  forwardRef,
  LegacyRef,
  memo,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import DefaultAvatar from '@assets/avatars/user-default.png';
import IconPicker from '@components/IconPicker';
import ActivityIcon from '@assets/comment-content/emojis/activities.json';
import AnimalIcon from '@assets/comment-content/emojis/animals.json';
import CuisineIcon from '@assets/comment-content/emojis/cuisines.json';
import FlagIcon from '@assets/comment-content/emojis/flags.json';
import ObjectIcon from '@assets/comment-content/emojis/objects.json';
import PlaceIcon from '@assets/comment-content/emojis/places.json';
import SmileIcon from '@assets/comment-content/emojis/smiles.json';
import SymbolIcon from '@assets/comment-content/emojis/symbols.json';
import classNames from 'classnames';
import themeFeature from '@features/theme';
import BabySoldierGifs from '@assets/comment-content/gifs/baby-soldiers.json';
import CheekyRabbitGifs from '@assets/comment-content/gifs/cheeky-rabbits.json';
import EmoGifs from '@assets/comment-content/gifs/emo-gifs.json';
import OnionGifs from '@assets/comment-content/gifs/onions.json';
import PandaGifs from '@assets/comment-content/gifs/pandas.json';
import TozokiRabbitGifs from '@assets/comment-content/gifs/tozoki-rabbits.json';
import TrollFaceGifs from '@assets/comment-content/gifs/troll-faces.json';
import YoyoMonkeyGifs from '@assets/comment-content/gifs/yoyo-monkeys.json';
import IconButton from '@components/IconButton';
import { CommentEditorProps } from './CommentEditor.type';
import PrimaryLoading from '@assets/icons/gifs/primary-loading.gif';

function CommentEditor(
  { isSubmitting = false, onChange, onSubmit, reset }: CommentEditorProps,
  ref: LegacyRef<HTMLDivElement>
) {
  const { t } = useTranslation();
  const themeValue = useAppSelector(themeFeature.themeSelector.selectValue);
  const profile = useAppSelector(authFeature.authSelector.selectUser);
  const inputRef = useRef<HTMLDivElement>(null);
  const [inputData, setInputData] = useState('');
  const [hiddenPlaceholder, setHiddenPlaceholder] = useState(false);

  useEffect(() => {
    if (reset?.value && inputRef.current) {
      inputRef.current.innerHTML = '';
      setInputData('');
      setHiddenPlaceholder(false);
    }
  }, [reset]);

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutaionRecord) => {
        if (mutaionRecord.target === inputRef.current) {
          setInputData((mutaionRecord.target as HTMLDivElement).innerHTML);
        }
      });
    });

    function handleChangeInput(this: HTMLDivElement, e: Event) {
      const content = (e.target as HTMLDivElement).innerHTML;
      setInputData(content === '<br>' ? '' : content);
    }
    if (inputRef.current) {
      inputRef.current.addEventListener('input', handleChangeInput);
      observer.observe(inputRef.current, {
        childList: true,
      });
    }
    return () => {
      removeEventListener('input', handleChangeInput);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (inputData != '') {
      setHiddenPlaceholder(true);
    } else {
      setHiddenPlaceholder(false);
    }
    if (onChange) {
      onChange(inputData);
    }
  }, [inputData]);

  return (
    <div ref={ref} className="flex justify-between items-start space-x-4">
      <div className="shrink-0">
        <img
          className={classNames(
            'desktop:w-16 tablet:w-12 mobile:w-8 desktop:h-16 tablet:h-12 mobile:h-8 rounded-full object-cover object-center',
            themeValue === 'light' ? 'light__boxShadow' : 'dark__boxShadow'
          )}
          src={profile ? UrlUtils.generateUrl(profile.avatar) : DefaultAvatar}
          alt="Avatar"
        />
      </div>

      <div
        className={classNames(
          'grow rounded-[8px] p-4',
          themeValue === 'light'
            ? 'bg-[var(--light-gray)]'
            : 'dark border-[1px] border-solid border-[var(--white)]'
        )}
      >
        <div>
          <div className="relative">
            <div
              ref={inputRef}
              className={classNames(
                'relative w-full min-h-[80px] outline-none bg-transparent z-[1] whitespace-pre-line break-all'
              )}
              contentEditable={true}
            />

            {!hiddenPlaceholder && (
              <div className="w-full h-full absolute top-0 left-0 z-[0] text-[var(--dark-gray)]">
                {t('comment.placeholder')}
              </div>
            )}
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div>
                <IconPicker
                  data={[
                    SmileIcon,
                    ActivityIcon,
                    AnimalIcon,
                    CuisineIcon,
                    FlagIcon,
                    ObjectIcon,
                    PlaceIcon,
                    SymbolIcon,
                  ]}
                  onClickedItem={(data) => inputRef.current?.appendChild(data)}
                />
              </div>

              <div>
                <IconPicker
                  activatedIcon={<i className="fa-solid fa-gift"></i>}
                  unactivatedIcon={<i className="fa-solid fa-gift"></i>}
                  fontSize={40}
                  data={[
                    TrollFaceGifs,
                    CheekyRabbitGifs,
                    YoyoMonkeyGifs,
                    BabySoldierGifs,
                    TozokiRabbitGifs,
                    EmoGifs,
                    OnionGifs,
                    PandaGifs,
                  ]}
                  onClickedItem={(data) => inputRef.current?.appendChild(data)}
                />
              </div>
            </div>

            <div>
              <IconButton
                sx={{
                  cursor: inputData == '' ? 'not-allowed' : 'pointer',
                  color: inputData == '' ? 'var(--gray)' : 'inherit',
                }}
                icon={
                  !isSubmitting ? (
                    <div className="w-[32px] h-[32px] flex justify-center items-center hover:text-[var(--primary)] rounded-[50%]">
                      <i className="fa-solid fa-paper-plane text-[1.2rem]"></i>
                    </div>
                  ) : (
                    <img
                      className="w-[32px] h-[32px] object-cover object-center"
                      src={PrimaryLoading}
                      alt="Loading"
                    />
                  )
                }
                onClick={() => inputData != '' && onSubmit && onSubmit()}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(forwardRef(CommentEditor));
