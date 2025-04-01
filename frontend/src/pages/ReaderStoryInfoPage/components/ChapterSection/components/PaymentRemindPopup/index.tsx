import Popup from '@components/Popup';
import { memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PaymentRemindPopupProps } from './PaymentRemindPopup.type';
import NumberUtils from '@utilities/number.util';
import Button from '@components/Button';
import LoadingWrapper from '@components/LoadingWrapper';
import useFetch from '@hooks/fetch.hook';
import apis from '@apis/index';
import { HttpStatus } from '@constants/http.constants';
import { useAppDispatch } from '@hooks/redux.hook';
import toastFeature from '@features/toast';
import { ToastType } from '@constants/toast.constants';
import { useNavigate } from 'react-router-dom';
import paths from '@routers/router.path';
import Protected from '@components/Protected';
import { Role } from '@constants/user.constants';

function PaymentRemindPopup({
  chapter,
  price,
  selectChapterTransId,
  onClose,
}: PaymentRemindPopupProps) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [enableProtected, setEnableProtected] = useState(false);
  const {
    data: isCreated,
    error: createInvoiceError,
    isLoading: isCreatingInvoice,
    setRefetch: setReCreateInvoice,
  } = useFetch<boolean>(
    apis.invoiceApi.createInvoice,
    {
      body: {
        chapterId: chapter.id,
      },
    },
    false
  );

  useEffect(() => {
    if (!isCreatingInvoice) {
      if (isCreated) {
        dispatch(
          toastFeature.toastAction.add({
            type: ToastType.SUCCESS,
            title: t(
              'reader.storyInfoPage.chapterListSection.paymentRemindPopup.paymentSuccess'
            ),
          })
        );
        navigate(
          paths.readerChapterContentPage(
            chapter.storyId,
            chapter.id,
            selectChapterTransId
          )
        );
        window.location.reload();
      } else {
        if (
          createInvoiceError?.response?.status === HttpStatus.PAYMENT_REQUIRED
        ) {
          dispatch(
            toastFeature.toastAction.add({
              type: ToastType.ERROR,
              title: t(
                'reader.storyInfoPage.chapterListSection.paymentRemindPopup.paymentFailed'
              ),
            })
          );
        }
      }
    }
  }, [isCreatingInvoice]);

  return (
    <LoadingWrapper
      isLoading={isCreatingInvoice}
      message={t(
        'reader.storyInfoPage.chapterListSection.paymentRemindPopup.loadingWrapper.message'
      )}
      level="page"
    >
      <Popup
        title={t(
          'reader.storyInfoPage.chapterListSection.paymentRemindPopup.title'
        )}
        onClose={onClose}
      >
        <div
          dangerouslySetInnerHTML={{
            __html: t(
              'reader.storyInfoPage.chapterListSection.paymentRemindPopup.content',
              { value: NumberUtils.formatNumberWithSeparator(String(price)) }
            ),
          }}
        />

        <div className="flex justify-end space-x-2 mt-2">
          <Protected role={Role.READER} enable={enableProtected}>
            <Button
              onClick={() => {
                setEnableProtected(true);
                setReCreateInvoice({
                  value: true,
                });
              }}
            >
              {t(
                'reader.storyInfoPage.chapterListSection.paymentRemindPopup.btn.ok'
              )}
            </Button>
          </Protected>

          <Button onClick={onClose}>
            {t(
              'reader.storyInfoPage.chapterListSection.paymentRemindPopup.btn.cancel'
            )}
          </Button>
        </div>
      </Popup>
    </LoadingWrapper>
  );
}

export default memo(PaymentRemindPopup);
