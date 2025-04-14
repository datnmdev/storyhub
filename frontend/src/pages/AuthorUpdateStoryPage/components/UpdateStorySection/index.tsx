import { memo } from 'react';
import TitleSection from './components/TitleSection';
import { useParams } from 'react-router-dom';
import AliasSection from './components/AliasSection';
import DescriptionSection from './components/DescriptionSection';
import IdSection from './components/IdSection';
import StoryTypeSection from './components/StoryTypeSection';
import CountrySection from './components/CountrySection';
import NotesSection from './components/NotesSection';
import CoverImageSection from './components/CoverImageSection';
import GenresSection from './components/GenresSection';
import PriceSection from './components/PriceSection';

function UpdateStorySection() {
  const { storyId } = useParams();

  return (
    <div>
      <div className="flex justify-between items-start space-x-4 my-4">
        <div className="grow space-y-4">
          <IdSection storyId={Number(storyId)} />
          <TitleSection storyId={Number(storyId)} />
          <AliasSection storyId={Number(storyId)} />
          <DescriptionSection storyId={Number(storyId)} />
          <StoryTypeSection storyId={Number(storyId)} />
          <CountrySection storyId={Number(storyId)} />
          <GenresSection storyId={Number(storyId)} />
          <PriceSection storyId={Number(storyId)} />
          <NotesSection storyId={Number(storyId)} />
        </div>

        <div className="shrink-0 flex items-center max-w-[320px]">
          <CoverImageSection storyId={Number(storyId)} />
        </div>
      </div>
    </div>
  );
}

export default memo(UpdateStorySection);
