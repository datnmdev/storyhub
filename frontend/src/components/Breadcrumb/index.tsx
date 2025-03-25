import { memo } from 'react';
import { BreadcrumbProps } from './Breadcrumb.type';
import { Link } from 'react-router-dom';

function Breadcrumb({ items = [], separator = '/' }: BreadcrumbProps) {
  return (
    <div className="space-x-1">
      {items.map((item, index) => {
        return (
          <span key={index} className="space-x-1 text-[1.1rem] font-[400]">
            <Link
              className="hover:underline hover:text-[var(--primary)]"
              to={item.path}
              state={item.state}
            >
              {item.label}
            </Link>
            <span>{separator}</span>
          </span>
        );
      })}
    </div>
  );
}

export default memo(Breadcrumb);
