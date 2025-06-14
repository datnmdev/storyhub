import IconButton from '@components/IconButton';
import themeFeature from '@features/theme';
import { useSelector } from 'react-redux';
import SunIcon from '@assets/icons/static/sun.png';
import MoonIcon from '@assets/icons/static/moon.png';
import { memo } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@store/store.type';

function ToggleThemeButton() {
  const dispatch = useDispatch<AppDispatch>();
  const themeValue = useSelector(themeFeature.themeSelector.selectValue);

  return (
    <IconButton
      icon={
        <img
          className="desktop:w-[2rem] tablet:w-[22px] mobile:w-[22px] desktop:h-[2rem] tablet:h-[22px] mobile:h-[22px] object-cover object-center"
          src={themeValue === 'light' ? SunIcon : MoonIcon}
        />
      }
      borderRadius="50%"
      onClick={() => dispatch(themeFeature.themeActions.toggle())}
    />
  );
}

export default memo(ToggleThemeButton);
