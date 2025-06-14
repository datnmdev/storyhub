export interface TinyMceEditorProps {
  placeholder?: string;
  onChange?: (value: string) => void;
  height?: number;
  readOnly?: boolean;
  onReady?: () => void;
}
