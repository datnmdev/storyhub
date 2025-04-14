import Input from '@components/Input';
import { memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { InputData, InputError, PriceSectionProps } from './PriceSection.type';
import IconButton from '@components/IconButton';
import Button from '@components/Button';
import useFetch from '@hooks/fetch.hook';
import apis from '@apis/index';
import { RequestInit } from '@apis/api.type';
import { useFormValidation } from '@hooks/validate.hook';
import { generateValidateSchema } from './PriceSection.schema';
import ErrorMessage from '@components/ErrorMessage';
import LoadingIcon from '@assets/icons/gifs/loading.gif';
import { useAppDispatch } from '@hooks/redux.hook';
import toastFeature from '@features/toast';
import { ToastType } from '@constants/toast.constants';

function PriceSection({ storyId }: PriceSectionProps) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [isEditable, setEditable] = useState(false);
  const {
    data: currentPriceResData,
    isLoading: isGettingCurrentPrice,
    setRefetch: setReGetCurrentPrice,
  } = useFetch(apis.priceApi.getCurrentPrice, {
    queries: {
      storyId,
    },
  });
  const [inputDataInit] = useState<InputData>({
    price: '0',
  });
  const [inputData, setInputData] = useState<InputData>(inputDataInit);
  const { values, handleChange, errors, validateAll } = useFormValidation<
    InputData,
    InputError
  >(inputData, generateValidateSchema());
  const [createPriceReq, setCreatePriceReq] = useState<RequestInit>({
    body: {
      storyId,
    },
  });
  const {
    data: createPriceResData,
    isLoading: isCreatingPrice,
    error: createPriceError,
    setRefetch: setReCreatePrice,
  } = useFetch(apis.priceApi.createPrice, createPriceReq, false);

  useEffect(() => {
    if (!isGettingCurrentPrice) {
      if (currentPriceResData) {
        setInputData({
          price: currentPriceResData,
        });
      }
    }
  }, [isGettingCurrentPrice]);

  useEffect(() => {
    setReGetCurrentPrice({
      value: true,
    });
  }, []);

  useEffect(() => {
    if (values) {
      setCreatePriceReq({
        body: {
          ...createPriceReq.body,
          amount: values.price,
        },
      });
    }
  }, [values]);

  useEffect(() => {
    if (!isCreatingPrice) {
      if (createPriceResData) {
        setEditable(false);
        setReGetCurrentPrice({
          value: true,
        });
        dispatch(
          toastFeature.toastAction.add({
            type: ToastType.SUCCESS,
            title: t('notification.createPriceSuccess'),
          })
        );
      } else {
        if (createPriceError) {
          dispatch(
            toastFeature.toastAction.add({
              type: ToastType.ERROR,
              title: t('notification.createPriceFailure'),
            })
          );
        }
      }
    }
  }, [isCreatingPrice]);

  return (
    <div>
      <div className="grow space-y-1">
        <div>
          {t('author.storyManagementPage.uploadStoryPopup.form.price.title')}
        </div>
        <div className="flex items-center justify-between">
          <div className="grow">
            <Input
              sx={{
                borderRadius: 4,
              }}
              readOnly={!isEditable}
              name="price"
              type="number"
              placeholder={t(
                'author.storyManagementPage.uploadStoryPopup.form.price.placeholder'
              )}
              value={values.price}
              onChange={handleChange}
            />
            {errors.price && <ErrorMessage message={errors.price} />}

            {isEditable && (
              <div className="flex justify-end mt-2 space-x-2">
                <Button
                  onClick={() => {
                    setInputData({
                      price:
                        typeof currentPriceResData === 'number'
                          ? String(currentPriceResData)
                          : inputDataInit.price,
                    });
                    setEditable(false);
                  }}
                >
                  {t('btns.cancel')}
                </Button>
                <Button
                  disabled={errors.price ? true : false}
                  onClick={async () => {
                    if (await validateAll()) {
                      setReCreatePrice({
                        value: true,
                      });
                    }
                  }}
                >
                  {isCreatingPrice ? (
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

export default memo(PriceSection);
