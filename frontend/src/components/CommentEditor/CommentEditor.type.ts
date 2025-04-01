export interface CommentEditorProps {
  isSubmitting?: boolean;
  onChange?: (value: string) => void;
  onSubmit?: () => void;
  reset?: { value: boolean };
}
