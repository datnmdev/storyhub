import { memo, useEffect, useRef, useState } from 'react';
import { UploadButtonProps } from './UploadButton.type';
import { v4 as uuidV4 } from 'uuid';
import PrimaryLoading from '@assets/icons/gifs/primary-loading.gif';

function UploadButton({
  value = null,
  loading = false,
  onChange,
}: UploadButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[] | null>(value);

  useEffect(() => {
    setFiles(value);
  }, [value]);

  useEffect(() => {
    onChange?.(files);
  }, [files]);

  return (
    <div className="inline-block cursor-pointer group select-none">
      <div
        className="flex items-center justify-center w-[100px] h-[100px] border-[1px] border-dashed border-[var(--gray)] group-hover:border-[var(--primary)] rounded-[4px]"
        style={{
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.6 : 1,
        }}
        onClick={() => !loading && fileInputRef.current?.click()}
      >
        {loading ? (
          <img
            src={PrimaryLoading}
            alt="Loading"
            className="w-12 h-12 object-cover object-center"
          />
        ) : (
          <i className="fa-solid fa-plus text-[var(--gray)] group-hover:text-[var(--primary)] text-[1.6rem]"></i>
        )}
      </div>

      <input
        key={uuidV4()}
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/jpg,image/jpeg,image/png,image/gif"
        onChange={(e) => e.target.files && setFiles(Array.from(e.target.files))}
        hidden
      />
    </div>
  );
}

export default memo(UploadButton);
