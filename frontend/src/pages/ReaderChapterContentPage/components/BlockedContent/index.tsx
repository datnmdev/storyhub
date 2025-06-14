import apis from '@apis/index';
import Button from '@components/Button';
import Protected from '@components/Protected';
import { Role } from '@constants/user.constants';
import authFeature from '@features/auth';
import useFetch from '@hooks/fetch.hook';
import { useAppSelector } from '@hooks/redux.hook';
import PaymentRemindPopup from '@pages/ReaderStoryInfoPage/components/ChapterSection/components/PaymentRemindPopup';
import { memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

function BlockedContent() {
  const { t } = useTranslation();
  const { storyId, chapterId } = useParams();
  const isAuthentication = useAppSelector(
    authFeature.authSelector.selectAuthenticated
  );
  const {
    data: currentPrice,
    isLoading: isGettingCurrentPrice,
    setRefetch: setReGetCurrentPrice,
  } = useFetch(
    apis.priceApi.getCurrentPrice,
    {
      queries: {
        storyId,
      },
    },
    false
  );
  const {
    data: chapterData,
    isLoading: isGettingChapter,
    setRefetch: setReGetChapter,
  } = useFetch(
    apis.chapterApi.getChapterWithFilter,
    {
      queries: {
        page: 1,
        limit: 1,
        id: chapterId,
      },
    },
    false
  );
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    if (!isGettingCurrentPrice) {
      if (currentPrice !== null) {
        setReGetChapter({
          value: true,
        });
      }
    }
  }, [isGettingCurrentPrice]);

  useEffect(() => {
    if (!isGettingChapter) {
      if (chapterData) {
        setHidden(false);
      }
    }
  }, [isGettingChapter]);

  return (
    <div>
      <div className="p-4 space-y-2 rounded-[8px]">
        <div className="flex justify-center text-[1.2rem] text-red-500 font-[450]">
          {t('reader.chapterContentPage.blockedContent.content')}
        </div>

        <div className="flex justify-center">
          <Button
            bgColor="red"
            onClick={() =>
              setReGetCurrentPrice({
                value: true,
              })
            }
          >
            {t('reader.chapterContentPage.blockedContent.btn.unlock')}
          </Button>
        </div>
      </div>

      {!hidden && (
        <Protected role={Role.READER} enable={!isAuthentication}>
          <PaymentRemindPopup
            chapter={chapterData[0][0]}
            price={currentPrice}
            selectChapterTransId={chapterData[0][0].chapterTranslations[0].id}
            onClose={() => setHidden(true)}
          />
        </Protected>
      )}
    </div>
  );
}

export default memo(BlockedContent);
