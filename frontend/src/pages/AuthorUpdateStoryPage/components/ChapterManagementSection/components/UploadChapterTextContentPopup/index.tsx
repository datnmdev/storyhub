import Popup from '@components/Popup';
import {
  InputData,
  InputError,
  UploadChapterTextContentPopupProps,
} from './UploadChapterTextContentPopup.type';
import { useTranslation } from 'react-i18next';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useFormValidation } from '@hooks/validate.hook';
import { generateValidateSchema } from './UploadChapterTextContentPopup.schema';
import ErrorMessage from '@components/ErrorMessage';
import Input from '@components/Input';
import { useAppDispatch } from '@hooks/redux.hook';
import TinyMceEditor from '@components/TinyMceEditor';
import useFetch from '@hooks/fetch.hook';
import apis from '@apis/index';
import Button from '@components/Button';
import { RequestInit } from '@apis/api.type';
import toastFeature from '@features/toast';
import { ToastType } from '@constants/toast.constants';
import Loading from '@components/Loading';
import IconButton from '@components/IconButton';

function UploadChapterTextContentPopup(
  props: UploadChapterTextContentPopupProps
) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [inputDataInit, setInputDataInit] = useState<InputData>({
    name: '',
    content: '',
  });
  const [inputData, setInputData] = useState<InputData>(inputDataInit);
  const { values, handleChange, errors, validateAll } = useFormValidation<
    InputData,
    InputError
  >(inputData, generateValidateSchema());
  const [uploadChapterReq, setUploadChapterReq] = useState<RequestInit>();
  const {
    data: uploadChapterResData,
    isLoading: isUploadingChapter,
    error: uploadChapterError,
    setRefetch: setReUploadChapter,
  } = useFetch(apis.chapterApi.uploadChapter, uploadChapterReq, false);
  const contentRef = useRef<any>(null);

  useEffect(() => {
    if (inputDataInit) {
      setInputData(inputDataInit);
    }
  }, [inputDataInit]);

  useEffect(() => {
    if (uploadChapterReq) {
      setReUploadChapter({
        value: true,
      });
    }
  }, [uploadChapterReq]);

  useEffect(() => {
    if (!isUploadingChapter) {
      if (uploadChapterResData !== null) {
        dispatch(
          toastFeature.toastAction.add({
            type: ToastType.SUCCESS,
            title: t('notification.uploadChapterSuccess'),
          })
        );
        if (props.setRefetchChapterList) {
          props.setRefetchChapterList({
            value: true,
          });
        }
        contentRef?.current?.setContent('');
        setInputDataInit({
          ...inputDataInit,
        });
      } else {
        if (uploadChapterError) {
          dispatch(
            toastFeature.toastAction.add({
              type: ToastType.ERROR,
              title: t('notification.uploadChapterFailure'),
            })
          );
        }
      }
    }
  }, [isUploadingChapter]);

  return (
    <Popup
      {...props}
      title={t(
        'author.updateStoryPage.chapterManagementSection.uploadChapterPopup.title'
      )}
      width={1000}
      maxHeight={580}
    >
      <div className="flex justify-between items-start space-x-4">
        <div className="grow space-y-4">
          <div>
            <div className="space-y-1">
              <div>
                {t(
                  'author.updateStoryPage.chapterManagementSection.uploadChapterPopup.form.name.title'
                )}
              </div>
              <Input
                sx={{
                  borderRadius: 4,
                }}
                name="name"
                type="text"
                placeholder={t(
                  'author.updateStoryPage.chapterManagementSection.uploadChapterPopup.form.name.placeholder'
                )}
                value={values.name}
                onChange={handleChange}
              />
            </div>
            {errors.name && <ErrorMessage message={errors.name} />}
          </div>

          <div>
            <div className="space-y-1">
              <div className='flex justify-between items-center'>
                <div>
                  {t(
                    'author.updateStoryPage.chapterManagementSection.uploadChapterPopup.form.textContent.title'
                  )}
                </div>
                {/* <div>
                  <IconButton padding='8px' icon={<i className="fa-solid fa-file-pdf text-[1.4rem] text-red-500"></i>} />
                </div> */}
              </div>
              <TinyMceEditor
                placeholder={t(
                  'author.updateStoryPage.chapterManagementSection.uploadChapterPopup.form.textContent.placeholder'
                )}
                ref={contentRef}
                height={450}
                onChange={(value) =>
                  handleChange({
                    target: { name: 'content', value },
                  } as ChangeEvent<HTMLInputElement>)
                }
              />
            </div>
            {errors.content && <ErrorMessage message={errors.content} />}
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2 mt-4">
        <Button
          onClick={async () => {
            if (await validateAll()) {
              setUploadChapterReq({
                body: {
                  ...values,
                  textContent: {
                    content: values.content,
                  },
                  storyId: props.storyId,
                },
              });
            }
          }}
        >
          {t(
            'author.updateStoryPage.chapterManagementSection.uploadChapterPopup.btns.uploadChapterBtn'
          )}
        </Button>

        <Button
          onClick={() => {
            contentRef?.current?.setContent('');
            setInputDataInit({
              ...inputDataInit,
            });
          }}
          bgColor="red"
        >
          {t(
            'author.updateStoryPage.chapterManagementSection.uploadChapterPopup.btns.resetBtn'
          )}
        </Button>
      </div>

      {isUploadingChapter && (
        <Loading
          level="page"
          backgroundVisible="frog"
          message={t('loading.uploadChapter')}
        />
      )}
    </Popup>
  );
}

export default UploadChapterTextContentPopup;
