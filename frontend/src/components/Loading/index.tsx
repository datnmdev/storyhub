import { memo } from 'react';
import LoadingIcon from '@assets/icons/gifs/beauty-loading.gif';
import { useSelector } from 'react-redux';
import themeFeature from '@features/theme';
import classNames from 'classnames';
import { LoadingProps } from './Loading.type';

function Loading({ messsage, backgroundVisible = 'default' }: LoadingProps) {
  const themeValue = useSelector(themeFeature.themeSelector.selectValue);

  return (
    <div className="w-[100vw] h-[100vh] bg-transparent fixed left-0 top-0 z-[1]">
      <div
        className={classNames(
          'absolute top-0 left-0 w-full h-full',
          themeValue === 'light' ? 'light' : 'dark',
          backgroundVisible === 'frog'
            ? 'opacity-60'
            : backgroundVisible === 'transparent'
              ? 'bg-transparent'
              : 'opacity-100'
        )}
      ></div>

      <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center z-[1]">
        <img className="w-24" src={LoadingIcon} alt="Loading Icon" />
        <div>{messsage}</div>
      </div>
    </div>
  );
}

export default memo(Loading);
