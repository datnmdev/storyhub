import { forwardRef, memo, useImperativeHandle, useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { TinyMceEditorProps } from './TinyMceEditor.type';

function TinyMceEditor(
  {
    placeholder = '',
    onChange,
    height = 240,
    readOnly = false,
    onReady,
  }: TinyMceEditorProps,
  ref?: any
) {
  const editorRef = useRef<any>(null);

  useImperativeHandle(ref, () => ({
    setContent: (value: string) => {
      editorRef.current?.setContent(value ?? '');
    },
    getContent: () => {
      return editorRef.current?.getContent() ?? '';
    },
  }));

  return (
    <Editor
      apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
      initialValue=""
      disabled={readOnly}
      onInit={(_evt: any, editor: any) => {
        editorRef.current = editor;
        onReady?.();
      }}
      onEditorChange={(newContent: string) => {
        if (onChange) {
          onChange(newContent);
        }
      }}
      init={{
        height,
        menubar: false,
        placeholder,
        plugins: [
          'advlist',
          'autolink',
          'lists',
          'link',
          'image',
          'charmap',
          'preview',
          'anchor',
          'searchreplace',
          'visualblocks',
          'code',
          'fullscreen',
          'insertdatetime',
          'media',
          'table',
          'code',
          'help',
          'wordcount',
        ],
        toolbar:
          'undo redo | blocks | ' +
          'bold italic forecolor | alignleft aligncenter ' +
          'alignright alignjustify | bullist numlist outdent indent | ' +
          'removeformat | help',
        content_style:
          'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
      }}
    />
  );
}

export default memo(forwardRef(TinyMceEditor));
