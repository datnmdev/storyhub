import ReaderFooter from '@components/ReaderFooter';
import ReaderHeader from '@components/ReaderHeader';
import themeFeature from '@features/theme';
import classNames from 'classnames';
import { PropsWithChildren } from 'react';
import { useSelector } from 'react-redux';

function ReaderLayout({ children }: PropsWithChildren) {
  const themeValue = useSelector(themeFeature.themeSelector.selectValue);

  return (
    <div
      className={classNames(
        themeValue === 'light' ? 'light' : 'dark',
        'min-h-[100vh] flex flex-col justify-between'
      )}
    >
      <ReaderHeader />

      <div className="grow">{children}</div>

      <ReaderFooter />
    </div>
  );
}

export default ReaderLayout;
