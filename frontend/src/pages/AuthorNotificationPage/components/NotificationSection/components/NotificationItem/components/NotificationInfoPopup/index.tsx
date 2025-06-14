import Popup from '@components/Popup';
import { PopupProps } from '@components/Popup/Popup.type';
import { ModerationRequestStatus } from '@constants/moderationRequest.constants';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import moment from 'moment';

interface NotificationInfoPopupProps extends PopupProps {
  data: any;
}

export default function NotificationInfoPopup(
  props: NotificationInfoPopupProps
) {
  const { t } = useTranslation();

  return (
    <Popup
      {...props}
      width={520}
      title={t(
        'author.notificationPage.notificationSection.notificationInfoPopup.title'
      )}
    >
      <div className="space-y-4">
        <div className="space-y-1">
          <div>
            {t(
              'author.notificationPage.notificationSection.notificationInfoPopup.formLabel.id'
            )}
          </div>
          <div className="px-4 py-2 border-[1px] border-solid border-[#ccc] rounded-[4px]">
            {props.data.notification.moderationRequest.id}
          </div>
        </div>

        <div className="space-y-1">
          <div>
            {t(
              'author.notificationPage.notificationSection.notificationInfoPopup.formLabel.status.label'
            )}
          </div>
          <div
            className={classNames(
              'px-4 py-2 rounded-[4px] inline-block text-white',
              props.data.notification.moderationRequest.status ===
                ModerationRequestStatus.APPROVED
                ? 'bg-green-500'
                : 'bg-red-500'
            )}
          >
            {t(
              `author.notificationPage.notificationSection.notificationInfoPopup.formLabel.status.values.${props.data.notification.moderationRequest.status}`
            )}
          </div>
        </div>

        <div className="space-y-1">
          <div>
            {t(
              'author.notificationPage.notificationSection.notificationInfoPopup.formLabel.storyId'
            )}
          </div>
          <div className="px-4 py-2 border-[1px] border-solid border-[#ccc] rounded-[4px]">
            {props.data.notification.moderationRequest.chapter.story.id}
          </div>
        </div>

        <div className="space-y-1">
          <div>
            {t(
              'author.notificationPage.notificationSection.notificationInfoPopup.formLabel.storyTitle'
            )}
          </div>
          <div className="px-4 py-2 border-[1px] border-solid border-[#ccc] rounded-[4px]">
            {props.data.notification.moderationRequest.chapter.story.title}
          </div>
        </div>

        <div className="space-y-1">
          <div>
            {t(
              'author.notificationPage.notificationSection.notificationInfoPopup.formLabel.chapterId'
            )}
          </div>
          <div className="px-4 py-2 border-[1px] border-solid border-[#ccc] rounded-[4px]">
            {props.data.notification.moderationRequest.chapter.id}
          </div>
        </div>

        <div className="space-y-1">
          <div>
            {t(
              'author.notificationPage.notificationSection.notificationInfoPopup.formLabel.chapterTitle'
            )}
          </div>
          <div className="px-4 py-2 border-[1px] border-solid border-[#ccc] rounded-[4px]">
            {props.data.notification.moderationRequest.chapter.name}
          </div>
        </div>

        <div className="space-y-1">
          <div>
            {t(
              'author.notificationPage.notificationSection.notificationInfoPopup.formLabel.moderatorId'
            )}
          </div>
          <div className="px-4 py-2 border-[1px] border-solid border-[#ccc] rounded-[4px]">
            {props.data.notification.moderationRequest.moderatorId}
          </div>
        </div>

        <div className="space-y-1">
          <div>
            {t(
              'author.notificationPage.notificationSection.notificationInfoPopup.formLabel.createdAt'
            )}
          </div>
          <div className="px-4 py-2 border-[1px] border-solid border-[#ccc] rounded-[4px]">
            {moment(props.data.notification.moderationRequest.createdAt).format(
              'DD/MM/YYYY HH:mm:ss'
            )}
          </div>
        </div>

        <div className="space-y-1">
          <div>
            {t(
              'author.notificationPage.notificationSection.notificationInfoPopup.formLabel.processAt'
            )}
          </div>
          <div className="px-4 py-2 border-[1px] border-solid border-[#ccc] rounded-[4px]">
            {moment(props.data.notification.moderationRequest.processAt).format(
              'DD/MM/YYYY HH:mm:ss'
            )}
          </div>
        </div>

        <div className="space-y-1">
          <div>
            {t(
              'author.notificationPage.notificationSection.notificationInfoPopup.formLabel.reason'
            )}
          </div>
          <div
            className="px-4 py-2 border-[1px] border-solid border-[#ccc] rounded-[4px]"
            dangerouslySetInnerHTML={{
              __html: props.data.notification.moderationRequest.reason,
            }}
          ></div>
        </div>
      </div>
    </Popup>
  );
}
