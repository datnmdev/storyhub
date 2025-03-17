import LogoIcon from '@assets/icons/logo.png';
import paths from '@routers/router.path';
import { memo } from 'react';
import { Link } from 'react-router-dom';

function Logo() {
  return (
    <Link to={paths.readerHomePage()}>
      <img
        className="inline-block desktop:w-[124px] tablet:w-[100px] mobile:w-[84px] object-cover object-center"
        src={LogoIcon}
      />
    </Link>
  );
}

export default memo(Logo);
