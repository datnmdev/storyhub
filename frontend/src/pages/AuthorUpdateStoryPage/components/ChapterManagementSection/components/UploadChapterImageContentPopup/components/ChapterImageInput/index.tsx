import { memo, useEffect, useMemo, useState } from 'react';
import { ChapterImageInputProps } from './ChapterImageInput.type';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Card from './components/Card';
import { ImageContentWithUrlPreview } from '../../UploadChapterImageContentPopup.type';
import UploadButton from './components/UploadButton';
import apis from '@apis/index';
import debounce from 'lodash.debounce';

const initialItems: ImageContentWithUrlPreview[] = [];

function ChapterImageInput({
  value = initialItems,
  onChange,
}: ChapterImageInputProps) {
  const [items, setItems] = useState<ImageContentWithUrlPreview[]>(value);
  const [files, setFiles] = useState<File[] | null>(null);
  const [upload, setUpload] = useState<any>({
    isLoading: false,
    data: null,
    error: null,
  });

  const moveItem = useMemo(
    () =>
      debounce((from: number, to: number) => {
        setItems((prevItems) => {
          const updated = [...prevItems];
          const [moved] = updated.splice(from, 1);
          updated.splice(to, 0, moved);
          return updated.map((item, index) => ({
            ...item,
            order: index + 1,
          }));
        });
      }, 30),
    []
  );

  function handleDeleteClicked(index: number) {
    const updated = [...items];
    updated.splice(index, 1);
    setItems(
      updated.map((item, index) => ({
        ...item,
        order: index + 1,
      }))
    );
  }

  useEffect(() => {
    async function uploadFiles(files: File[]) {
      try {
        setUpload((prev: any) => ({
          ...prev,
          isLoading: true,
          error: null,
        }));

        const data = await Promise.all(
          files.map(
            (file) =>
              new Promise(async (resolve, reject) => {
                try {
                  const getUploadUrlResData = await (
                    await apis.uploadApi.getUploadUrl({
                      queries: {
                        fileType: file.type,
                      },
                    })
                  ).data;
                  await apis.uploadApi.upload({
                    uri: getUploadUrlResData.preUploadUrl,
                    body: file,
                    headers: {
                      'Content-Type': file.type,
                    },
                  });
                  resolve({
                    path: getUploadUrlResData.fileKey,
                    previewUrl: URL.createObjectURL(file),
                  });
                } catch (error) {
                  reject(error);
                }
              })
          )
        );

        setUpload((prev: any) => ({
          ...prev,
          data,
        }));

        setUpload((prev: any) => ({
          ...prev,
          isLoading: false,
          error: null,
        }));
      } catch (error) {
        setUpload((prev: any) => ({
          ...prev,
          error,
        }));
      }
    }

    if (files) {
      uploadFiles(files);
    }
  }, [files]);

  useEffect(() => {
    setItems(value);
  }, [value]);

  useEffect(() => {
    if (!upload.isLoading) {
      if (upload.data) {
        setItems([
          ...items,
          ...upload.data.map((e: any, index: number) => ({
            order:
              items.length > 0
                ? items[items.length - 1].order + index + 1
                : index + 1,
            ...e,
          })),
        ]);
      }
    }
  }, [upload.isLoading]);

  useEffect(() => {
    onChange?.(items);
  }, [items]);

  return (
    <DndProvider backend={HTML5Backend}>
      <ul className="list-none -mt-2 -ml-2 flex flex-wrap">
        {items.map((item, index) => (
          <Card
            key={item.order}
            item={item}
            index={index}
            moveItem={moveItem}
            onDeleteClick={() => handleDeleteClicked(index)}
          />
        ))}

        <li className="mt-2 ml-2">
          <UploadButton
            onChange={(files) => setFiles(files)}
            loading={upload.isLoading}
          />
        </li>
      </ul>
    </DndProvider>
  );
}

export default memo(ChapterImageInput);
