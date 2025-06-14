import { ChangeEvent, memo, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  DescriptionSectionProps,
  InputData,
  InputError,
} from './DescriptionSection.type';
import IconButton from '@components/IconButton';
import Button from '@components/Button';
import { Story } from '@pages/ReaderHomePage/components/NewUpdateStorySection/NewUpdateStorySection.type';
import useFetch from '@hooks/fetch.hook';
import apis from '@apis/index';
import { RequestInit } from '@apis/api.type';
import { useFormValidation } from '@hooks/validate.hook';
import { generateValidateSchema } from './DescriptionSection.schema';
import ErrorMessage from '@components/ErrorMessage';
import LoadingIcon from '@assets/icons/gifs/loading.gif';
import { useAppDispatch } from '@hooks/redux.hook';
import toastFeature from '@features/toast';
import { ToastType } from '@constants/toast.constants';
import TinyMceEditor from '@components/TinyMceEditor';

function DescriptionSection({ storyId }: DescriptionSectionProps) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [isEditable, setEditable] = useState(false);
  const descriptionRef = useRef<any>(null);
  const [isEditorReady, setEditorReady] = useState(false);
  const {
    data: storyData,
    isLoading: isGettingStory,
    setRefetch: setReGetStory,
  } = useFetch<[Story[], number]>(apis.storyApi.getStoryWithFilter, {
    queries: {
      id: storyId,
      page: 1,
      limit: 1,
    },
  });
  const [inputDataInit] = useState<InputData>({
    description: '',
  });
  const [inputData, setInputData] = useState<InputData>(inputDataInit);
  const { values, handleChange, errors, validateAll } = useFormValidation<
    InputData,
    InputError
  >(inputData, generateValidateSchema());
  const [updateStoryReq, setUpdateStoryReq] = useState<RequestInit>({
    params: {
      storyId,
    },
  });
  const {
    data: updateStoryResData,
    isLoading: isUpdatingStory,
    error: updateStoryError,
    setRefetch: setReUpdateStory,
  } = useFetch(apis.storyApi.updateStory, updateStoryReq, false);

  useEffect(() => {
    setReGetStory({
      value: true,
    });
  }, []);

  useEffect(() => {
    if (!isGettingStory) {
      if (storyData) {
        setInputData({
          description: storyData[0][0].description,
        });
      }
    }
  }, [isGettingStory]);

  useEffect(() => {
    if (values) {
      setUpdateStoryReq({
        ...updateStoryReq,
        body: {
          ...values,
        },
      });
    }
  }, [values]);

  useEffect(() => {
    if (!isUpdatingStory) {
      if (updateStoryResData) {
        setEditable(false);
        setReGetStory({
          value: true,
        });
        dispatch(
          toastFeature.toastAction.add({
            type: ToastType.SUCCESS,
            title: t('notification.updateDescriptionSuccess'),
          })
        );
      } else {
        if (updateStoryError) {
          dispatch(
            toastFeature.toastAction.add({
              type: ToastType.ERROR,
              title: t('notification.updateDescriptionFailure'),
            })
          );
        }
      }
    }
  }, [isUpdatingStory]);

  useEffect(() => {
    if (isEditorReady) {
      descriptionRef.current.setContent(inputData.description);
    }
  }, [isEditorReady]);

  return (
    <div>
      <div className="grow space-y-1">
        <div>
          {t(
            'author.storyManagementPage.uploadStoryPopup.form.description.title'
          )}
        </div>
        <div className="flex items-center justify-between">
          <div className="grow">
            <TinyMceEditor
              placeholder={t(
                'author.storyManagementPage.uploadStoryPopup.form.description.placeholder'
              )}
              ref={descriptionRef}
              readOnly={!isEditable}
              onReady={() => setEditorReady(true)}
              onChange={(value) =>
                handleChange({
                  target: { name: 'description', value },
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
                      storyData
                        ? storyData[0][0].description
                        : inputDataInit.description
                    );
                    setInputData({
                      description: storyData
                        ? storyData[0][0].description
                        : inputDataInit.description,
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
                      setReUpdateStory({
                        value: true,
                      });
                    }
                  }}
                >
                  {isUpdatingStory ? (
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

export default memo(DescriptionSection);
