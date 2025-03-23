import usePagination from '@mui/material/usePagination';
import { styled } from '@mui/material/styles';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { PaginationProps } from './Pagination.type';

const List = styled('ul')({
  listStyle: 'none',
  padding: 0,
  margin: 0,
  display: 'flex',
});

function Pagination(props: PaginationProps) {
  const { t } = useTranslation();
  const { items } = usePagination(props);

  return (
    <nav>
      <List className="space-x-4">
        {items.map(({ page, type, selected, ...item }, index) => {
          let children = null;
          if (type === 'start-ellipsis' || type === 'end-ellipsis') {
            children = <span className="font-[600]">...</span>;
          } else if (type === 'page') {
            children = (
              <button
                className="px-4 py-2 rounded-[4px] hover:text-[var(--primary)]"
                type="button"
                style={{
                  backgroundColor: selected ? 'var(--primary)' : undefined,
                  color: selected ? 'var(--white)' : undefined,
                }}
                {...item}
              >
                {page}
              </button>
            );
          } else if (type === 'previous') {
            children = (
              <button
                className="space-x-3 hover:text-[var(--primary)] w-[72px]"
                type="button"
                {...item}
                style={{
                  opacity: item.disabled ? 0.4 : 1,
                }}
              >
                <span>
                  <i className="fa-solid fa-arrow-left"></i>
                </span>

                <span>{t('pagination.previous')}</span>
              </button>
            );
          } else if (type === 'next') {
            children = (
              <button
                className="space-x-3 hover:text-[var(--primary)] w-[72px]"
                type="button"
                {...item}
                style={{
                  opacity: item.disabled ? 0.4 : 1,
                }}
              >
                <span>{t('pagination.next')}</span>

                <span>
                  <i className="fa-solid fa-arrow-right"></i>
                </span>
              </button>
            );
          }

          return (
            <li key={index} className="flex items-center justify-center">
              {children}
            </li>
          );
        })}
      </List>
    </nav>
  );
}

export default memo(Pagination);
