import apis from '@apis/index';
import Slider from '@components/Slider';
import useFetch from '@hooks/fetch.hook';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Story } from '../NewUpdateStorySection/NewUpdateStorySection.type';
import BeautySlide from './components/BeautySlide';

function SliderSection() {
  const { t } = useTranslation();
  const { data, isLoading } = useFetch<[Story[], number]>(
    apis.viewApi.getTopViewStory,
    {
      queries: {
        page: 1,
        limit: 10,
      },
    }
  );

  if (isLoading || data === null) {
    return null;
  }

  return (
    <div className="space-y-2">
      <h3 className="text-[1.4rem] font-semibold">
        {t('reader.homePage.topViewSlider.title')}
      </h3>

      <div>
        <Slider>
          {data[0].map((story) => {
            return <BeautySlide key={story.id} data={story} />;
          })}
        </Slider>
      </div>
    </div>
  );
}

export default memo(SliderSection);
