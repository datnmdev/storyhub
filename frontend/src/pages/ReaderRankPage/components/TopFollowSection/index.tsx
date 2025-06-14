import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import TopStoryList from './components/TopStoryList';

function TopFollowSection() {
  const { t } = useTranslation();

  return (
    <div>
      <h3 className="text-[1.8rem] font-[500] font-sans text-transparent [background-image:linear-gradient(90deg,#977EF5_0%,#D33567_32%,#FF0000_100%)] bg-clip-text">
        {t('reader.rankPage.topFollowSection.title')}
      </h3>

      <div className="mt-6">
        <TopStoryList />
      </div>
    </div>
  );
}

export default memo(TopFollowSection);
