import classNames from 'classnames';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './Nav.module.scss';
import { Link, useNavigate } from 'react-router-dom';
import paths from '@routers/router.path';
import { StoryType } from '@constants/story.constants';

function Nav() {
  const { t } = useTranslation();
  const navigate = useNavigate();

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

      <div
        className={classNames(
          'desktop:px-2 tablet:px-4 mobile:px-4 cursor-pointer',
          styles.item
        )}
        onClick={() => {
          navigate(paths.storyFilterPage(), {
            state: {
              storyType: StoryType.NOVEL,
            },
          });
          window.location.reload();
        }}
        onTouchStart={() => {
          navigate(paths.storyFilterPage(), {
            state: {
              storyType: StoryType.NOVEL,
            },
          });
          window.location.reload();
        }}
      >
        {t('reader.header.nav.novel')}
      </div>

      <div
        className={classNames(
          'desktop:px-2 tablet:px-4 mobile:px-4 cursor-pointer',
          styles.item
        )}
        onClick={() => {
          navigate(paths.storyFilterPage(), {
            state: {
              storyType: StoryType.COMIC,
            },
          });
          window.location.reload();
        }}
        onTouchStart={() => {
          navigate(paths.storyFilterPage(), {
            state: {
              storyType: StoryType.COMIC,
            },
          });
          window.location.reload();
        }}
      >
        {t('reader.header.nav.comic')}
      </div>

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
