import Logo from '@assets/icons/logo.png';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import qs from 'qs';

function Footer() {
  const { t } = useTranslation();
  return (
    <div className="border-t-[4px] border-solid border-[var(--gray)] bg-[#d9d9d91a] py-4">
      <div className="grid desktop:grid-cols-12 tablet:grid-cols-3 mobile:grid-cols-1 desktop:w-[var(--desktop-container-w)] tablet:w-[var(--tablet-container-w)] mobile:w-[var(--mobile-container-w)] mx-auto gap-x-2 space-y-8">
        <div className="desktop:col-span-3 tablet:col-span-1 mobile:col-span-1 space-y-2 desktop:block tablet:block mobile:flex mobile:flex-col mobile:items-center">
          <div className="space-y-2">
            <img className="w-56" src={Logo} alt="Logo" />

            <div className="text-[var(--dark-gray)] text-[0.8rem]">
              © 2024 Story For All. All rights reserved
            </div>
          </div>

          <ul className="flex text-[1.6rem] space-x-1">
            <li>
              <Link className="text-[#015eff] hover:opacity-60" to="#">
                <i className="fa-brands fa-square-facebook"></i>
              </Link>
            </li>

            <li>
              <Link className="text-red-500 hover:opacity-60" to="#">
                <i className="fa-brands fa-youtube"></i>
              </Link>
            </li>

            <li>
              <Link className="text-sky-500 hover:opacity-60" to="#">
                <i className="fa-brands fa-telegram"></i>
              </Link>
            </li>

            <li>
              <Link className="text-orange-500 hover:opacity-60" to="#">
                <i className="fa-brands fa-instagram"></i>
              </Link>
            </li>
          </ul>

          <div>
            <a
              href="//www.dmca.com/Protection/Status.aspx?ID=6b5e2b32-744e-478c-8e5a-44cfa49f85dd"
              title="DMCA.com Protection Status"
              className="dmca-badge"
            >
              <img
                src="https://images.dmca.com/Badges/DMCA_logo-bw140w.png?ID=6b5e2b32-744e-478c-8e5a-44cfa49f85dd"
                alt="DMCA.com Protection Status"
              />
            </a>
            <script src="https://images.dmca.com/Badges/DMCABadgeHelper.min.js"></script>
          </div>
        </div>

        <div className="desktop:col-span-3 tablet:col-span-1 mobile:col-span-1 mobile desktop:text-left tablet:text-left mobile:text-center">
          <div className="text-[1.2rem] font-semibold">
            {t('reader.footer.contact.heading')}
          </div>

          <ul className="mt-2 space-y-1 desktop:block tablet:block mobile:flex mobile:flex-col mobile:items-center">
            <li>
              <Link
                className="space-x-2 hover:underline hover:text-[var(--primary)]"
                to={`mailto:${t('reader.footer.contact.email')}`}
              >
                <i className="fa-regular fa-envelope text-[#1f87d8] text-[1.2rem]"></i>
                <span>{t('reader.footer.contact.email')}</span>
              </Link>
            </li>

            <li>
              <Link
                className="space-x-2 hover:underline hover:text-[var(--primary)]"
                to={`tel:${t('reader.footer.contact.phone')}`}
              >
                <i className="fa-solid fa-phone text-[#0abb08] text-[1.2rem]"></i>
                <span>{t('reader.footer.contact.phone')}</span>
              </Link>
            </li>

            <li>
              <Link
                className="space-x-2 hover:underline hover:text-[var(--primary)]"
                to={`https://www.google.com/maps?${qs.stringify({ q: t('reader.footer.contact.address') }, { encode: true })}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fa-solid fa-location-dot text-red-500 text-[1.2rem]"></i>
                <span>{t('reader.footer.contact.address')}</span>
              </Link>
            </li>
          </ul>
        </div>

        <div className="desktop:col-span-3 tablet:col-span-1 mobile:col-span-1 desktop:block tablet:block mobile:flex mobile:flex-col mobile:items-center">
          <div className="text-[1.2rem] font-semibold">
            {t('reader.footer.about.heading')}
          </div>

          <ul className="mt-2 space-y-1">
            <li>
              <Link
                className="space-x-2 hover:underline hover:text-[var(--primary)]"
                to="#"
              >
                <i className="fa-solid fa-lock text-yellow-500 text-[1.2rem]"></i>
                <span>{t('reader.footer.about.privacy')}</span>
              </Link>
            </li>

            <li>
              <Link
                className="space-x-2 hover:underline hover:text-[var(--primary)]"
                to="#"
              >
                <i className="fa-solid fa-check-double text-[#0abb08] text-[1.2rem]"></i>
                <span>{t('reader.footer.about.term')}</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Footer;
