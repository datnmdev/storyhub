import Input from '@components/Input';
import { memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { InputData, InputError, TitleSectionProps } from './TitleSection.type';
import IconButton from '@components/IconButton';
import Button from '@components/Button';
import { Story } from '@pages/ReaderHomePage/components/NewUpdateStorySection/NewUpdateStorySection.type';
import useFetch from '@hooks/fetch.hook';
import apis from '@apis/index';
import { RequestInit } from '@apis/api.type';
import { useFormValidation } from '@hooks/validate.hook';
import { generateValidateSchema } from './TitleSection.schema';
import ErrorMessage from '@components/ErrorMessage';
import LoadingIcon from '@assets/icons/gifs/loading.gif';
import { useAppDispatch } from '@hooks/redux.hook';
import toastFeature from '@features/toast';
import { ToastType } from '@constants/toast.constants';

function TitleSection({ storyId }: TitleSectionProps) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [isEditable, setEditable] = useState(false);
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
    title: '',
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
    if (!isGettingStory) {
      if (storyData) {
        setInputData({
          title: storyData[0][0].title,
        });
      }
    }
  }, [isGettingStory]);

  useEffect(() => {
    setReGetStory({
      value: true,
    });
  }, []);

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
            title: t('notification.updateTitleSuccess'),
          })
        );
      } else {
        if (updateStoryError) {
          dispatch(
            toastFeature.toastAction.add({
              type: ToastType.ERROR,
              title: t('notification.updateTitleFailure'),
            })
          );
        }
      }
    }
  }, [isUpdatingStory]);

  return (
    <div>
      <div className="grow space-y-1">
        <div>
          {t('author.storyManagementPage.uploadStoryPopup.form.title.title')}
        </div>
        <div className="flex items-center justify-between">
          <div className="grow">
            <Input
              sx={{
                borderRadius: 4,
              }}
              readOnly={!isEditable}
              name="title"
              type="text"
              placeholder={t(
                'author.storyManagementPage.uploadStoryPopup.form.title.placeholder'
              )}
              value={values.title}
              onChange={handleChange}
            />
            {errors.title && <ErrorMessage message={errors.title} />}

            {isEditable && (
              <div className="flex justify-end mt-2 space-x-2">
                <Button
                  onClick={() => {
                    setInputData({
                      title: storyData
                        ? storyData[0][0].title
                        : inputDataInit.title,
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

export default memo(TitleSection);
