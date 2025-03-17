import IconButton from '@components/IconButton';
import DarkSearchIcon from '@assets/icons/static/dark-search.png';
import LightSearchIcon from '@assets/icons/static/light-search.png';
import { useSelector } from 'react-redux';
import themeFeature from '@features/theme';
import { memo } from 'react';

function SearchButton() {
  const themeValue = useSelector(themeFeature.themeSelector.selectValue);

  return (
    <IconButton
      icon={
        <img
          className="desktop:w-[28px] tablet:w-[22px] mobile:w-[20px] desktop:h-[28px] tablet:h-[22px] mobile:h-[20px]  object-cover object-center"
          src={themeValue === 'light' ? LightSearchIcon : DarkSearchIcon}
        />
      }
      borderRadius="50%"
    />
  );
}

export default memo(SearchButton);
