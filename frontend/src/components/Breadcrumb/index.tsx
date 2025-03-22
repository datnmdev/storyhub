import { memo } from 'react';
import { BreadcrumbProps } from './Breadcrumb.type';
import { Link } from 'react-router-dom';

function Breadcrumb({ items = [], separator = '/' }: BreadcrumbProps) {
  return (
    <div className="space-x-1">
      {items.map((item, index) => {
        return (
          <span key={index} className="space-x-1 text-[1.1rem] font-[400]">
            <span>{index != 0 && separator}</span>
            <Link
              className="hover:underline hover:text-[var(--primary)]"
              to={item.path}
            >
              {item.label}
            </Link>
          </span>
        );
      })}
    </div>
  );
}

export default memo(Breadcrumb);
