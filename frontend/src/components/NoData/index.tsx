import { memo } from 'react';
import { NoDataProps } from './NoData.type';
import NoDataIcon from '@assets/icons/static/not-data.png';
import { useTranslation } from 'react-i18next';

function NoData({ children }: NoDataProps) {
  const { t } = useTranslation();

  return (
    <div className="h-full flex justify-center items-center">
      {children || (
        <div className="flex justify-center items-center space-x-4">
          <div>
            <img className="w-16" src={NoDataIcon} alt="No Data" />
          </div>

          <div className="text-[var(--gray)]">{t('noData')}</div>
        </div>
      )}
    </div>
  );
}

export default memo(NoData);
