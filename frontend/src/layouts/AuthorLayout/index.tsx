import AuthorHeader from '@components/AuthorHeader';
import ReaderFooter from '@components/ReaderFooter';
import ViewportNotSupported from '@components/ViewportNotSupported';
import themeFeature from '@features/theme';
import classNames from 'classnames';
import { PropsWithChildren, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

function AuthorLayout({ children }: PropsWithChildren) {
  const themeValue = useSelector(themeFeature.themeSelector.selectValue);
  const [isViewportNotSupported, setViewportNotSupported] = useState(false);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 1024) {
        setViewportNotSupported(true);
      } else {
        setViewportNotSupported(false);
      }
    }

    window.addEventListener('resize', handleResize);
    return () => {
      removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div
      className={classNames(
        themeValue === 'light' ? 'light' : 'dark',
        'min-h-[100vh] flex flex-col justify-between transition-colors duration-1000 ease-in-out'
      )}
    >
      <AuthorHeader />

      {isViewportNotSupported || window.innerWidth < 1024 ? (
        <ViewportNotSupported />
      ) : (
        <div className="grow flex flex-col">{children}</div>
      )}

      <ReaderFooter />
    </div>
  );
}

export default AuthorLayout;
