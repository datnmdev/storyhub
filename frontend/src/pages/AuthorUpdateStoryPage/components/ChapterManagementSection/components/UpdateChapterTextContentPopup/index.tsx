import Popup from '@components/Popup';
import { UpdateChapterTextContentPopupProps } from './UpdateChapterTextContentPopup.type';
import { useTranslation } from 'react-i18next';
import IdSection from './components/IdSection';
import StatusSection from './components/StatusSection';
import NameSection from './components/NameSection';
import ContentSection from './components/ContentSection';

function UpdateChapterTextContentPopup(
  props: UpdateChapterTextContentPopupProps
) {
  const { t } = useTranslation();

  return (
    <Popup
      {...props}
      title={t(
        'author.updateStoryPage.chapterManagementSection.updateChapterPopup.title'
      )}
      width={1000}
      maxHeight={580}
    >
      <div className="mb-4 space-y-4">
        <IdSection chapterId={props.chapterId} />
        <NameSection
          chapterId={props.chapterId}
          setRefetchChapterList={props.setRefetchChapterList}
        />
        <StatusSection chapterId={props.chapterId} />
        <ContentSection chapterId={props.chapterId} />
      </div>
    </Popup>
  );
}

export default UpdateChapterTextContentPopup;
