import { PaginationProps as MuiPaginationProps } from '@mui/material';

export interface Pagination {
  page: number;
  limit: number;
}

export interface PaginationProps extends MuiPaginationProps {}
