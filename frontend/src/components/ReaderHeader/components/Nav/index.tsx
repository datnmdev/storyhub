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
        to={paths.readerHomePage()}
        className={classNames(
          'desktop:px-2 tablet:px-4 mobile:px-4 cursor-pointer',
          styles.item
        )}
      >
        {t('reader.header.nav.home')}
      </Link>

      <Link
        to="/"
        className={classNames(
          'desktop:px-2 tablet:px-4 mobile:px-4 cursor-pointer',
          styles.item
        )}
      >
        {t('reader.header.nav.novel')}
      </Link>

      <Link
        to="/"
        className={classNames(
          'desktop:px-2 tablet:px-4 mobile:px-4 cursor-pointer',
          styles.item
        )}
      >
        {t('reader.header.nav.comic')}
      </Link>

      <Link
        to={paths.storyFilterPage()}
        className={classNames(
          'desktop:px-2 tablet:px-4 mobile:px-4 cursor-pointer',
          styles.item
        )}
      >
        {t('reader.header.nav.search')}
      </Link>

      <Link
        to={paths.readerRankPage()}
        className={classNames(
          'desktop:px-2 tablet:px-4 mobile:px-4 cursor-pointer',
          styles.item
        )}
      >
        {t('reader.header.nav.rank')}
      </Link>
    </nav>
  );
}

export default memo(Nav);
