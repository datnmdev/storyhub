import LogoIcon from '@assets/icons/logo.png';
import paths from '@routers/router.path';
import { memo } from 'react';

function Logo() {
  return (
    <div
      onClick={() => (window.location.href = paths.authorStoryManagementPage())}
    >
      <img
        className="inline-block desktop:w-[124px] tablet:w-[100px] mobile:w-[84px] object-cover object-center"
        src={LogoIcon}
      />
    </div>
  );
}

export default memo(Logo);
