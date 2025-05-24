import { useTranslation } from 'react-i18next';

function ViewportNotSupported() {
  const { t } = useTranslation();

  return (
    <div className="w-[100vw] h-[100vh] flex items-center justify-center bg-[var(--primary)]">
      <div className="text-center space-x-2 p-6 text-white font-[500]">
        <i className="fa-solid fa-triangle-exclamation text-[1.4rem] text-yellow-400"></i>
        <span>{t('viewportNotSupported')}</span>
      </div>
    </div>
  );
}

export default ViewportNotSupported;
