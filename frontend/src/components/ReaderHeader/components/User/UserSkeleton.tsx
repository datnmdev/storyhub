import { memo } from 'react';
import { Skeleton } from '@mui/material';

function UserSkeleton() {
  return (
    <div className="border-[2px] border-solid rounded-[50%] border-[var(--gray)]">
      {/* Desktop */}
      <div className='desktop:block tablet:hidden mobile:hidden'>
        <Skeleton variant="circular" animation="wave" width={32} height={32} />
      </div>

      {/* Mobile & Tablet */}
      <div className='desktop:hidden tablet:block mobile:block'>
        <Skeleton variant="circular" animation="wave" width={20} height={20} />
      </div>
    </div>
  );
}

export default memo(UserSkeleton);
