import Button from '@components/Button';
import Popup from '@components/Popup';
import { PopupProps } from '@components/Popup/Popup.type';
import TinyMceEditor from '@components/TinyMceEditor';
import { StoryType } from '@constants/story.constants';
import UrlUtils from '@utilities/url.util';
import classNames from 'classnames';
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { InputData, InputError } from './ModerationPopup.type';
import { useFormValidation } from '@hooks/validate.hook';
import { generateValidateSchema } from './ModerationPopup.schema';
import ErrorMessage from '@components/ErrorMessage';
import { RequestInit } from '@apis/api.type';
import useFetch from '@hooks/fetch.hook';
import apis from '@apis/index';
import { ModerationRequestStatus } from '@constants/moderationRequest.constants';
import { useAppDispatch } from '@hooks/redux.hook';
import toastFeature from '@features/toast';
import { ToastType } from '@constants/toast.constants';
import Loading from '@components/Loading';

interface ModerationPopupProps extends PopupProps {
  setRefetchModerationRequestList: Dispatch<SetStateAction<{ value: boolean }>>;
  data: any;
  setOpenModerationPopup: Dispatch<SetStateAction<boolean>>;
}

function ModerationPopup(props: ModerationPopupProps) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [inputDataInit] = useState<InputData>({
    reason: '',
  });
  const { values, handleChange, errors, validateAll } = useFormValidation<
    InputData,
    InputError
  >(inputDataInit, generateValidateSchema());
  const reasonRef = useRef<any>(null);
  const [updateModerationRequest, setUpdateModerationRequest] =
    useState<RequestInit>({
      params: {
        moderationRequestId: props.data?.id,
      },
    });
  const {
    data: updateModerationRequestResData,
    isLoading: isUpdatingModerationRequest,
    error: updateModerationRequestError,
    setRefetch: setReUpdateModerationRequest,
  } = useFetch(
    apis.moderationRequestApi.updateModerationRequest,
    updateModerationRequest,
    false
  );

  useEffect(() => {
    setUpdateModerationRequest({
      ...updateModerationRequest,
      params: {
        ...updateModerationRequest.params,
        moderationRequestId: props.data?.id,
      },
    });
    reasonRef.current.setContent(inputDataInit.reason);
  }, [props.data]);

  useEffect(() => {
    setUpdateModerationRequest({
      ...updateModerationRequest,
      body: {
        ...updateModerationRequest.body,
        reason: values.reason,
      },
    });
  }, [values]);

  useEffect(() => {
    if (!isUpdatingModerationRequest) {
      if (typeof updateModerationRequestResData === 'boolean') {
        props.setOpenModerationPopup(false);
        props.setRefetchModerationRequestList({
          value: true,
        });
        dispatch(
          toastFeature.toastAction.add({
            type: ToastType.SUCCESS,
            title: t('notification.updateModerationRequestSuccess'),
          })
        );
      } else {
        if (updateModerationRequestError) {
          props.setOpenModerationPopup(false);
          dispatch(
            toastFeature.toastAction.add({
              type: ToastType.ERROR,
              title: t('notification.updateModerationRequestFailure'),
            })
          );
        }
      }
    }
  }, [isUpdatingModerationRequest, updateModerationRequestResData]);

  return (
    <Popup
      {...props}
      title={t(
        'moderator.moderationRequestManagementPage.moderationPopup.title'
      )}
      width={1000}
      minHeight={620}
      sx={{
        overflow: 'hidden',
      }}
    >
      <div className="flex justify-between items-stretch space-x-4 overflow-hidden">
        <div className="grow w-1/2 overflow-hidden">
          <h3 className="text-center text-[1.1rem] font-[500]">
            {t(
              'moderator.moderationRequestManagementPage.moderationPopup.chapterContentSection'
            )}
          </h3>
          <div className="border-[1px] border-solid border-gray-300 rounded-[4px] mt-2 p-4 overflow-y-auto h-[520px]">
            <div
              className={classNames(
                props.data?.chapter?.story?.type === StoryType.NOVEL
                  ? 'block'
                  : 'hidden'
              )}
              dangerouslySetInnerHTML={{
                __html:
                  props.data?.chapter?.chapterTranslations?.[0]?.textContent
                    ?.content ?? '',
              }}
            ></div>

            <div
              className={classNames(
                'space-y-4',
                props.data?.chapter?.story?.type === StoryType.COMIC
                  ? 'block'
                  : 'hidden'
              )}
            >
              {(
                props.data?.chapter?.chapterTranslations?.[0]?.imageContents ??
                []
              ).map((imageContent: any) => {
                return (
                  <div key={imageContent.id} className="space-y-1">
                    <div className="px-4 py-2 bg-green-500 text-white rounded-[8px]">
                      {t(
                        'moderator.moderationRequestManagementPage.moderationPopup.pageNumber',
                        { value: imageContent.order }
                      )}
                    </div>

                    <div>
                      <img
                        src={UrlUtils.generateUrl(imageContent.path)}
                        alt={t(
                          'moderator.moderationRequestManagementPage.moderationPopup.pageNumber',
                          { value: imageContent.order }
                        )}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="grow w-1/2 overflow-hidden flex flex-col">
          <h3 className="text-center text-[1.1rem] font-[500]">
            {t(
              'moderator.moderationRequestManagementPage.moderationPopup.actionSection'
            )}
          </h3>
          <div className="grow flex flex-col justify-between border-[1px] border-solid border-gray-300 rounded-[4px] mt-2 p-4 overflow-hidden h-[520px] space-y-4">
            <div className="grow overflow-y-auto px-4">
              <div className="space-y-2">
                <div>Thông điệp tới tác giả</div>
                <TinyMceEditor
                  height={408}
                  placeholder={t(
                    'moderator.moderationRequestManagementPage.moderationPopup.placeholder'
                  )}
                  ref={reasonRef}
                  onChange={(value) =>
                    handleChange({
                      target: { name: 'reason', value },
                    } as ChangeEvent<HTMLInputElement>)
                  }
                />
                {errors.reason && <ErrorMessage message={errors.reason} />}
              </div>
            </div>

            <div className="flex space-x-2 justify-end">
              <Button
                bgColor="red"
                onClick={async () => {
                  if (await validateAll()) {
                    setUpdateModerationRequest((prev) => ({
                      ...prev,
                      body: {
                        ...prev.body,
                        status: ModerationRequestStatus.REJECTED,
                      },
                    }));
                    setReUpdateModerationRequest({
                      value: true,
                    });
                  }
                }}
              >
                Từ chối duyệt
              </Button>
              <Button
                onClick={async () => {
                  if (await validateAll()) {
                    setUpdateModerationRequest((prev) => ({
                      ...prev,
                      body: {
                        ...prev.body,
                        status: ModerationRequestStatus.APPROVED,
                      },
                    }));
                    setReUpdateModerationRequest({
                      value: true,
                    });
                  }
                }}
              >
                Duyệt
              </Button>
            </div>
          </div>
        </div>
      </div>

      {isUpdatingModerationRequest && <Loading />}
    </Popup>
  );
}

export default ModerationPopup;
