import { Pagination } from '@components/Pagination/Pagination.type';

export interface FilterInputData extends Pagination {
  authorId?: string;
  status: string;
  countryId?: string;
  type?: string;
  orderBy: string;
  genres?: string;
}

export interface FilterFormSectionProps {
  onChange?: (data: FilterInputData) => void;
  onSubmit?: () => void;
}
