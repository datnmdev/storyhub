export interface BreadcrumbProps {
  items: Array<{
    label: string;
    path: string;
    state?: any;
  }>;
  separator?: React.ReactNode;
}
