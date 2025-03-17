import { memo } from 'react';
import LoadingIcon from '@assets/icons/gifs/beauty-loading.gif';
import { useSelector } from 'react-redux';
import themeFeature from '@features/theme';
import classNames from 'classnames';

function Loading() {
  const themeValue = useSelector(themeFeature.themeSelector.selectValue);

  return (
    <div
      className={classNames(
        'h-[100vh] flex justify-center items-center',
        themeValue === 'light' ? 'light' : 'dark'
      )}
    >
      <img className="w-24" src={LoadingIcon} alt="Loading Icon" />
    </div>
  );
}

export default memo(Loading);
