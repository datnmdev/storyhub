import Input from '@components/Input';
import { memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { InputData, InputError, NameSectionProps } from './NameSection.type';
import IconButton from '@components/IconButton';
import Button from '@components/Button';
import useFetch from '@hooks/fetch.hook';
import apis from '@apis/index';
import { RequestInit } from '@apis/api.type';
import { useFormValidation } from '@hooks/validate.hook';
import { generateValidateSchema } from './NameSection.schema';
import ErrorMessage from '@components/ErrorMessage';
import LoadingIcon from '@assets/icons/gifs/loading.gif';
import { useAppDispatch } from '@hooks/redux.hook';
import toastFeature from '@features/toast';
import { ToastType } from '@constants/toast.constants';
import { Chapter } from '@apis/chapter';

function NameSection({ chapterId, setRefetchChapterList }: NameSectionProps) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [isEditable, setEditable] = useState(false);
  const {
    data: chapterData,
    isLoading: isGettingChapter,
    setRefetch: setReGetChapter,
  } = useFetch<[Chapter[], number]>(
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
    name: '',
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
    if (!isGettingChapter) {
      if (chapterData) {
        setInputData({
          name: chapterData[0][0].name,
        });
      }
    }
  }, [isGettingChapter]);

  useEffect(() => {
    setReGetChapter({
      value: true,
    });
  }, []);

  useEffect(() => {
    if (values) {
      setUpdateChapterReq({
        ...updateChapterReq,
        body: {
          ...values,
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
            title: t('notification.updateChapterNameSuccess'),
          })
        );
        setRefetchChapterList({
          value: true,
        });
      } else {
        if (updateChapterError) {
          dispatch(
            toastFeature.toastAction.add({
              type: ToastType.ERROR,
              title: t('notification.updateChapterNameFailure'),
            })
          );
        }
      }
    }
  }, [isUpdatingChapter]);

  return (
    <div>
      <div className="grow space-y-1">
        <div>
          {t(
            'author.updateStoryPage.chapterManagementSection.updateChapterPopup.name.title'
          )}
        </div>
        <div className="flex items-center justify-between">
          <div className="grow">
            <Input
              sx={{
                borderRadius: 4,
              }}
              readOnly={!isEditable}
              name="name"
              type="text"
              placeholder={t(
                'author.updateStoryPage.chapterManagementSection.updateChapterPopup.name.placeholder'
              )}
              value={values.name}
              onChange={handleChange}
            />
            {errors.name && <ErrorMessage message={errors.name} />}

            {isEditable && (
              <div className="flex justify-end mt-2 space-x-2">
                <Button
                  onClick={() => {
                    setInputData({
                      name: chapterData
                        ? chapterData[0][0].name
                        : inputDataInit.name,
                    });
                    setEditable(false);
                  }}
                >
                  {t('btns.cancel')}
                </Button>
                <Button
                  disabled={errors.name ? true : false}
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

export default memo(NameSection);
