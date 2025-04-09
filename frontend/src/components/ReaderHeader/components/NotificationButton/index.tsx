import notificationFeature from '@features/notification';
import { useAppSelector } from '@hooks/redux.hook';
import paths from '@routers/router.path';
import { useWebSocket } from 'libs/socket';
import { memo, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

function NotificationButton() {
  const bellRef = useRef<HTMLDivElement>(null);
  const allUnSeenNotifications = useAppSelector(
    notificationFeature.notificationSelector.selectAllUnSeenNotifications
  );
  const socket = useWebSocket();

  useEffect(() => {
    if (socket) {
      socket.on('notification', () => {
        if (bellRef.current) {
          bellRef.current.classList.add('animate-ring');
          setTimeout(() => {
            if (bellRef.current) {
              bellRef.current.classList.remove('animate-ring');
            }
          }, 1000);
        }
      });
    }
  }, [socket]);

  return (
    <Link
      className="relative hover:opacity-60"
      to={paths.readerNotificationPage()}
    >
      <div ref={bellRef} className="flex items-center">
        <i className="fa-solid fa-bell desktop:text-[1.8rem] tablet:text-[20px] mobile:text-[18px]"></i>
      </div>

      <span className="leading-none absolute -top-1 -right-3 bg-red-500 text-[var(--white)] px-1 py-0.5 desktop:text-[0.8rem] tablet:text-[0.8rem] mobile:text-[0.6rem] rounded-[4px]">
        {allUnSeenNotifications && allUnSeenNotifications.total > 99
          ? '99+'
          : allUnSeenNotifications.total}
      </span>
    </Link>
  );
}

export default memo(NotificationButton);
