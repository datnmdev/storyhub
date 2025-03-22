import apis from '@apis/index';
import Breadcrumb from '@components/Breadcrumb';
import { BreadcrumbProps } from '@components/Breadcrumb/Breadcrumb.type';
import Button from '@components/Button';
import useFetch from '@hooks/fetch.hook';
import paths from '@routers/router.path';
import { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Wallet } from './WalletPage.type';
import NumberUtils from '@utilities/number.util';
import classNames from 'classnames';
import { useAppSelector } from '@hooks/redux.hook';
import themeFeature from '@features/theme';
import DepositePopup from './components/DepositePopup';

function WalletPage() {
  const { t } = useTranslation();
  const { data: wallet } = useFetch<Wallet>(
    apis.walletApi.getWallet
  );
  const themeValue = useAppSelector(themeFeature.themeSelector.selectValue);
  const [isOpenDepositePopup, setOpenDepositePopup] = useState<boolean>(false);

  const breadcrumbItems: BreadcrumbProps['items'] = [
    {
      label: t('reader.walletPage.breadcrumb.items.homePage'),
      path: paths.readerHomePage(),
    },
    {
      label: t('reader.walletPage.breadcrumb.items.walletPage'),
      path: paths.walletPage(),
    },
  ];

  return (
    <div className="grow desktop:w-[var(--desktop-container-w)] tablet:w-[var(--tablet-container-w)] mobile:w-[var(--mobile-container-w)] mx-auto py-8">
      <div>
        <Breadcrumb items={breadcrumbItems} />
      </div>

      <div className="flex desktop:flex-row tablet:flex-col mobile:flex-col justify-between items-stretch mt-2 min-h-[520px] desktop:space-x-4 table:space-x-0 mobile:space-x-0 desktop:space-y-0 tablet:space-y-4 mobile:space-y-4">
        <div className="desktop:w-[280px] tablet:w-full mobile:w-full">
          <h3 className="font-semibold text-[1.4rem]">
            {t('reader.walletPage.sidebar.heading')}
          </h3>
          <ul className="desktop:block tablet:flex mobile:flex desktop:mt-2 tablet:mt-2 mobile:mt-2">
            <li className='grow'>
              <Link
                className=" desktop:justify-start tablet:justify-center mobile:justify-center px-4 rounded-[4px] leading-[38px] space-x-2 flex items-center bg-[var(--primary)] text-[var(--white)]"
                to={paths.walletPage()}
              >
                <span className="text-[1.2rem]">
                  <i className="fa-solid fa-wallet"></i>
                </span>
                <span className='desktop:block tablet:hidden mobile:hidden'>{t('reader.walletPage.sidebar.walletInfo')}</span>
              </Link>
            </li>

            <li className='grow'>
              <Link
                className=" desktop:justify-start tablet:justify-center mobile:justify-center px-4 rounded-[4px] hover:text-[var(--primary)] leading-[38px] space-x-2 flex items-center"
                to={paths.walletPage()}
              >
                <span className="text-[1.2rem]">
                  <i className="fa-solid fa-building-columns"></i>
                </span>
                <span className='desktop:block tablet:hidden mobile:hidden'>{t('reader.walletPage.sidebar.depositeHistory')}</span>
              </Link>
            </li>

            <li className='grow'>
              <Link
                className=" desktop:justify-start tablet:justify-center mobile:justify-center px-4 rounded-[4px] hover:text-[var(--primary)] leading-[38px] space-x-2 flex items-center"
                to={paths.walletPage()}
              >
                <span className="text-[1.2rem]">
                  <i className="fa-solid fa-money-bills"></i>
                </span>
                <span className='desktop:block tablet:hidden mobile:hidden'>{t('reader.walletPage.sidebar.paymentHistory')}</span>
              </Link>
            </li>
          </ul>
        </div>

        <div
          className={classNames(
            'grow p-4 desktop:rounded-none tablet:rounded-[4px] mobile:rounded-[4px]',
            themeValue === 'light' ? 'bg-[var(--light-gray)]' : 'bg-[#242121]'
          )}
        >
          <div className="flex items-center">
            <span>{t('reader.walletPage.content.balanceTitle')}</span>
            <span className="ml-20 text-red-500 font-semibold text-[1.4rem]">
              {wallet !== null &&
                NumberUtils.formatNumberWithSeparator(wallet.balance)}{' '}
              VND
            </span>
          </div>

          <div className="mt-2">
            <Button height={38} onClick={() => setOpenDepositePopup(true)}>
              {t('reader.walletPage.content.depositeBtn')}
            </Button>
          </div>
        </div>
      </div>

      {isOpenDepositePopup && (
        <DepositePopup
          title={t('reader.walletPage.content.depositePopupTitle')}
          onClose={() => setOpenDepositePopup(false)}
        />
      )}
    </div>
  );
}

export default memo(WalletPage);
