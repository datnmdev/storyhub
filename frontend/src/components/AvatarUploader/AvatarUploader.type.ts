export interface AvatarUploaderProps {
  theme?: 'rounded' | 'default';
  previewUrl?: string;
  value: File | null;
  onChange?: (file: File) => void;
}
