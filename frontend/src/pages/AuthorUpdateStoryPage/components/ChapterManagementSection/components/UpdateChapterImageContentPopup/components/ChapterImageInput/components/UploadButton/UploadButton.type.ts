export interface UploadButtonProps {
  value?: File[] | null;
  onChange?: (files: File[] | null) => void;
  loading?: boolean;
  hidden?: boolean;
}
