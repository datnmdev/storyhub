import { ChangeEvent, memo, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ContentSectionProps,
  InputData,
  InputError,
} from './ContentSection.type';
import IconButton from '@components/IconButton';
import Button from '@components/Button';
import useFetch from '@hooks/fetch.hook';
import apis from '@apis/index';
import { RequestInit } from '@apis/api.type';
import { useFormValidation } from '@hooks/validate.hook';
import { generateValidateSchema } from './ContentSection.schema';
import ErrorMessage from '@components/ErrorMessage';
import LoadingIcon from '@assets/icons/gifs/loading.gif';
import { useAppDispatch } from '@hooks/redux.hook';
import toastFeature from '@features/toast';
import { ToastType } from '@constants/toast.constants';
import TinyMceEditor from '@components/TinyMceEditor';

function ContentSection({ chapterId }: ContentSectionProps) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [isEditable, setEditable] = useState(false);
  const descriptionRef = useRef<any>(null);
  const [isEditorReady, setEditorReady] = useState(false);
  const {
    data: chapterData,
    isLoading: isGettingChapter,
    setRefetch: setReGetChapter,
  } = useFetch<[any[], number]>(
    apis.chapterApi.getChapterForAuthorWithFilter,
    {
      queries: {
        id: chapterId,
        page: 1,
        limit: 1,
      },
    }
  );
  const [inputDataInit] = useState<InputData>({
    content: '',
  });
  const [inputData, setInputData] = useState<InputData>(inputDataInit);
  const { values, handleChange, errors, validateAll } = useFormValidation<
    InputData,
    InputError
  >(inputData, generateValidateSchema());
  const [updateChapterReq, setUpdateChapterReq] = useState<RequestInit>({
    params: {
      chapterId,
    },
  });
  const {
    data: updateChapterResData,
    isLoading: isUpdatingChapter,
    error: updateChapterError,
    setRefetch: setReUpdateChapter,
  } = useFetch(apis.chapterApi.updateChapter, updateChapterReq, false);

  useEffect(() => {
    setReGetChapter({
      value: true,
    });
  }, []);

  useEffect(() => {
    if (!isGettingChapter) {
      if (chapterData) {
        setInputData({
          content: chapterData[0][0].chapterTranslations.filter(
            (chapterTranslation: any) =>
              chapterTranslation.countryId === chapterData[0][0].story.countryId
          )?.[0]?.textContent?.content,
        });
      }
    }
  }, [isGettingChapter]);

  useEffect(() => {
    if (values) {
      setUpdateChapterReq({
        ...updateChapterReq,
        body: {
          ...values,
          textContent: {
            content: values.content,
          },
        },
      });
    }
  }, [values]);

  useEffect(() => {
    if (!isUpdatingChapter) {
      if (updateChapterResData) {
        setEditable(false);
        setReGetChapter({
          value: true,
        });
        dispatch(
          toastFeature.toastAction.add({
            type: ToastType.SUCCESS,
            title: t('notification.updateContentSuccess'),
          })
        );
      } else {
        if (updateChapterError) {
          dispatch(
            toastFeature.toastAction.add({
              type: ToastType.ERROR,
              title: t('notification.updateContentFailure'),
            })
          );
        }
      }
    }
  }, [isUpdatingChapter]);

  useEffect(() => {
    if (isEditorReady) {
      descriptionRef.current.setContent(inputData.content);
    }
  }, [isEditorReady]);

  return (
    <div>
      <div className="grow space-y-1">
        <div>
          {t(
            'author.updateStoryPage.chapterManagementSection.updateChapterPopup.content.title'
          )}
        </div>
        <div className="flex items-center justify-between">
          <div className="grow">
            <TinyMceEditor
              placeholder={t(
                'author.updateStoryPage.chapterManagementSection.updateChapterPopup.content.placeholder'
              )}
              ref={descriptionRef}
              readOnly={!isEditable}
              onReady={() => setEditorReady(true)}
              onChange={(value) =>
                handleChange({
                  target: { name: 'content', value },
                } as ChangeEvent<HTMLInputElement>)
              }
            />
            {errors.description && (
              <ErrorMessage message={errors.description} />
            )}

            {isEditable && (
              <div className="flex justify-end mt-2 space-x-2">
                <Button
                  onClick={() => {
                    descriptionRef?.current?.setContent(
                      chapterData
                        ? chapterData[0][0].chapterTranslations.filter(
                            (chapterTranslation: any) =>
                              chapterTranslation.countryId ===
                              chapterData[0][0].story.countryId
                          )?.[0]?.text?.content
                        : inputDataInit.content
                    );
                    setInputData({
                      content: chapterData
                        ? chapterData[0][0].chapterTranslations.filter(
                            (chapterTranslation: any) =>
                              chapterTranslation.countryId ===
                              chapterData[0][0].story.countryId
                          )?.[0]?.text?.content
                        : inputDataInit.content,
                    });
                    setEditable(false);
                  }}
                >
                  {t('btns.cancel')}
                </Button>
                <Button
                  disabled={errors.title ? true : false}
                  onClick={async () => {
                    if (await validateAll()) {
                      setReUpdateChapter({
                        value: true,
                      });
                    }
                  }}
                >
                  {isUpdatingChapter ? (
                    <div className="flex items-center space-x-0.5">
                      <img
                        width={32}
                        height={32}
                        src={LoadingIcon}
                        alt="Loading"
                      />

                      <span>{t('loading.save')}</span>
                    </div>
                  ) : (
                    t('btns.save')
                  )}
                </Button>
              </div>
            )}
          </div>

          <IconButton
            sx={{
              visibility: isEditable ? 'hidden' : 'visible',
            }}
            icon={<i className="fa-solid fa-pen text-[1.2rem] p-4"></i>}
            onClick={() => setEditable(true)}
          />
        </div>
      </div>
    </div>
  );
}

export default memo(ContentSection);
