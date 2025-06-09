import classNames from 'classnames';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './Nav.module.scss';
import { Link } from 'react-router-dom';
import paths from '@routers/router.path';

function Nav() {
  const { t } = useTranslation();

  return (
    <nav className="flex desktop:flex-row tablet:flex-col mobile:flex-col font-[350]">
      <Link
        to={paths.moderatorModerationRequestManagementPage()}
        className={classNames(
          'desktop:px-2 tablet:px-4 mobile:px-4 cursor-pointer',
          styles.item
        )}
      >
        {t('moderator.header.nav.moderationRequestManagementPage')}
      </Link>
    </nav>
  );
}

export default memo(Nav);
