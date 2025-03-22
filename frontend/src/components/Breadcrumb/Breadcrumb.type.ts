export interface BreadcrumbProps {
  items: Array<{
    label: string;
    path: string;
  }>;
  separator?: React.ReactNode;
}
