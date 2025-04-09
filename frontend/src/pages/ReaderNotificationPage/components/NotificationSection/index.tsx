import { memo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@hooks/redux.hook';
import NoData from '@components/NoData';
import notificationFeature from '@features/notification';
import Button from '@components/Button';
import { useTranslation } from 'react-i18next';
import { Notification } from '@apis/notification';
import NotificationItem from './components/NotificationItem';

function NotificationSection() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const allNotifications = useAppSelector(
    notificationFeature.notificationSelector.selectAllNotifications
  );
  const allUnSeenNotifications = useAppSelector(
    notificationFeature.notificationSelector.selectAllUnSeenNotifications
  );
  const [selectedTab, setSelectedTab] = useState(0);

  return (
    <div>
      <div className="flex justify-between items-center">
        <h3 className="text-[1.4rem] font-semibold">
          {t('reader.notificationPage.notificationSection.title')}
        </h3>

        <Button
          width={80}
          height={32}
          onClick={() =>
            dispatch(
              notificationFeature.notificationThunk.deleteAllNotification()
            )
          }
        >
          {t('reader.notificationPage.notificationSection.btn.deleteAllBtn')}
        </Button>
      </div>

      <div className="mt-4 flex items-center space-x-2">
        <Button
          sx={{
            borderRadius: 20,
            backgroundColor:
              selectedTab === 0 ? 'var(--primary)' : 'transparent',
            color: selectedTab === 0 ? 'var(--white)' : 'var(--dark-gray)',
            fontWeight: 500,
            border: selectedTab === 0 ? 'none' : '1px solid var(--dark-gray)',
          }}
          width={120}
          onClick={() => setSelectedTab(0)}
        >
          {t(
            'reader.notificationPage.notificationSection.btn.allNotificationsBtn'
          )}
        </Button>

        <Button
          sx={{
            borderRadius: 20,
            backgroundColor:
              selectedTab === 1 ? 'var(--primary)' : 'transparent',
            color: selectedTab === 1 ? 'var(--white)' : 'var(--dark-gray)',
            fontWeight: 500,
            border: selectedTab === 1 ? 'none' : '1px solid var(--dark-gray)',
          }}
          width={120}
          onClick={() => setSelectedTab(1)}
        >
          {t(
            'reader.notificationPage.notificationSection.btn.allUnSeenNotificationsBtn'
          )}
        </Button>
      </div>

      {selectedTab === 0 &&
        (allNotifications.data.length > 0 ? (
          <div className="grow mt-6 space-y-6">
            <div className="grid desktop:grid-cols-2 tablet:grid-cols-2 mobile:grid-cols-1 gap-4">
              {allNotifications.data.map((notification: Notification) => {
                return (
                  <NotificationItem
                    key={notification.notificationId}
                    data={notification}
                  />
                );
              })}
            </div>

            <div className="flex justify-center items-start">
              <Button
                sx={{
                  display:
                    allNotifications.total === allNotifications.data.length
                      ? 'none'
                      : 'flex',
                }}
                onClick={() => {
                  dispatch(
                    notificationFeature.notificationAction.setAllNotificationPagination(
                      {
                        page: allNotifications.pagination.page,
                        limit: allNotifications.pagination.limit + 12,
                      }
                    )
                  );
                  dispatch(
                    notificationFeature.notificationThunk.getAllNotification()
                  );
                }}
              >
                {t('reader.notificationPage.notificationSection.btn.moreBtn')}
              </Button>
            </div>
          </div>
        ) : (
          <div className="min-h-[320px] flex items-center justify-center">
            <NoData />
          </div>
        ))}

      {selectedTab === 1 &&
        (allUnSeenNotifications.data.length > 0 ? (
          <div className="grow mt-6 space-y-6">
            <div className="grid desktop:grid-cols-2 tablet:grid-cols-2 mobile:grid-cols-1 gap-4">
              {allUnSeenNotifications.data.map((notification: Notification) => {
                return (
                  <NotificationItem
                    key={notification.notificationId}
                    data={notification}
                  />
                );
              })}
            </div>

            <div className="flex justify-center items-start">
              <Button
                sx={{
                  display:
                    allUnSeenNotifications.total ===
                    allUnSeenNotifications.data.length
                      ? 'none'
                      : 'flex',
                }}
                onClick={() => {
                  dispatch(
                    notificationFeature.notificationAction.setAllUnSeenNotificationPagination(
                      {
                        page: allNotifications.pagination.page,
                        limit: allNotifications.pagination.limit + 12,
                      }
                    )
                  );
                  dispatch(
                    notificationFeature.notificationThunk.getAllUnSeenNotifications()
                  );
                }}
              >
                {t('reader.notificationPage.notificationSection.btn.moreBtn')}
              </Button>
            </div>
          </div>
        ) : (
          <div className="min-h-[320px] flex items-center justify-center">
            <NoData />
          </div>
        ))}
    </div>
  );
}

export default memo(NotificationSection);
