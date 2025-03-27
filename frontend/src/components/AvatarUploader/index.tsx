import themeFeature from '@features/theme';
import { useAppSelector } from '@hooks/redux.hook';
import classNames from 'classnames';
import { memo, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AvatarDefault from '@assets/avatars/user-default.png';
import Button from '@components/Button';
import { AvatarUploaderProps } from './AvatarUploader.type';

function AvatarUploader({
  theme = 'default',
  previewUrl,
  value,
  onChange,
}: AvatarUploaderProps) {
  const { t } = useTranslation();
  const themeValue = useAppSelector(themeFeature.themeSelector.selectValue);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isClicked, setClicked] = useState({
    value: false,
  });
  const [file, setFile] = useState<File | null>(value);
  const [key, setKey] = useState(Date.now());

  useEffect(() => {
    if (isClicked.value) {
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    }
  }, [isClicked]);

  useEffect(() => {
    if (file && onChange) {
      onChange(file);
    }
  }, [file]);

  useEffect(() => {
    setKey(Date.now());
    setFile(value);
  }, [value]);

  return (
    <div className="space-y-4">
      <div className="flex justify-center items-center">
        <img
          className={classNames(
            'object-cover object-center',
            themeValue === 'light' ? 'light__boxShadow' : 'dark__boxShadow',
            theme === 'rounded'
              ? 'rounded-full w-[120px] h-[120px]'
              : 'w-[128px] h-[158px]'
          )}
          src={
            file
              ? URL.createObjectURL(file)
              : previewUrl
                ? previewUrl
                : AvatarDefault
          }
          alt="Avatar"
        />

        <input
          key={key}
          ref={fileInputRef}
          type="file"
          accept="image/jpg,image/jpeg,image/png,image/gif"
          onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])}
          hidden
        />
      </div>

      <div className="flex justify-center items-center">
        <Button
          onClick={() =>
            setClicked({
              value: true,
            })
          }
        >
          {t('avatarUpload.changeAvatarBtn')}
        </Button>
      </div>

      <div className="flex justify-center items-center text-[0.9rem] italic px-10 text-center">
        {t('avatarUpload.uploadImageNote')}
      </div>
    </div>
  );
}

export default memo(AvatarUploader);
