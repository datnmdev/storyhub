import { memo, useEffect, useState } from 'react';
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
import ErrorMessage from '@components/ErrorMessage';
import LoadingIcon from '@assets/icons/gifs/loading.gif';
import { useAppDispatch } from '@hooks/redux.hook';
import toastFeature from '@features/toast';
import { ToastType } from '@constants/toast.constants';
import { generateValidateSchema } from './ContentSection.schema';
import ChapterImageInput from '../ChapterImageInput';

function ContentSection({ chapterId }: ContentSectionProps) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [isEditable, setEditable] = useState(false);
  const {
    data: chapterData,
    isLoading: isGettingChapter,
    setRefetch: setReGetChapter,
  } = useFetch<[any[], number]>(apis.chapterApi.getChapterForAuthorWithFilter, {
    queries: {
      id: chapterId,
      page: 1,
      limit: 1,
    },
  });
  const [inputDataInit] = useState<InputData>({
    imageContents: [],
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
          imageContents: chapterData[0][0].chapterTranslations.filter(
            (chapterTranslation: any) =>
              chapterTranslation.countryId === chapterData[0][0].story.countryId
          )?.[0]?.imageContents,
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
          imageContents: values.imageContents,
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

  return (
    <div>
      <div className="grow space-y-2">
        <div>
          {t(
            'author.updateStoryPage.chapterManagementSection.updateChapterPopup.content.title'
          )}
        </div>
        <div className="flex items-center justify-between">
          <div className="grow border-[1px] border-solid border-[#ccc] rounded-[4px] p-4">
            <ChapterImageInput
              mode={isEditable ? 'edit' : 'view'}
              value={values.imageContents}
              onChange={(value) =>
                handleChange({
                  target: { name: 'imageContents', value },
                }) as any
              }
            />
            {errors.imageContents && (
              <ErrorMessage message={errors.imageContents} />
            )}

            {isEditable && (
              <div className="flex justify-end mt-2 space-x-2">
                <Button
                  onClick={() => {
                    setInputData({
                      imageContents: chapterData
                        ? chapterData[0][0].chapterTranslations.filter(
                            (chapterTranslation: any) =>
                              chapterTranslation.countryId ===
                              chapterData[0][0].story.countryId
                          )?.[0]?.imageContents
                        : inputDataInit.imageContents,
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
