import Popup from '@components/Popup';
import {
  DepositePopupProps,
  InputData,
  InputError,
} from './DepositePopup.type';
import InputWithIcon from '@components/InputWithIcon';
import ErrorMessage from '@components/ErrorMessage';
import { useTranslation } from 'react-i18next';
import { useFormValidation } from '@hooks/validate.hook';
import { generateValidateSchema } from './DepositePopup.schema';
import useFetch from '@hooks/fetch.hook';
import apis from '@apis/index';
import SelectWithIcon from '@components/SelectWithIcon';
import IconButton from '@components/IconButton';
import LoadingIcon from '@assets/icons/gifs/loading.gif';
import MenuItem from '@components/MenuItem';
import { BankCode } from '@constants/payment.constant';
import { useEffect } from 'react';

function DepositePopup({ title, onClose }: DepositePopupProps) {
  const { t } = useTranslation();
  const { values, handleChange, errors, validateAll } = useFormValidation<
    InputData,
    InputError
  >(
    {
      amount: '',
      bankCode: '-1',
    },
    generateValidateSchema()
  );
  const { data, isLoading, error, setRefetch } = useFetch<string>(
    apis.depositeTransactionApi.createPaymentUrl,
    { body: values },
    false
  );

  useEffect(() => {
    if (!isLoading) {
      console.log(data);
      if (data) {
        
        
        window.location.href = data;
      }
    }
  }, [isLoading]);

  return (
    <Popup title={title} onClose={onClose}>
      <div className="space-y-2">
        {error && (
          <div className="bg-red-500 text-white p-4 rounded-[4px] animate-fadeIn">
            {t('notification.undefinedError')}
          </div>
        )}

        <div>
          <InputWithIcon
            name="amount"
            type="text"
            icon={<i className="fa-solid fa-money-bill"></i>}
            placeholder={t('reader.walletPage.content.depositePopup.amount')}
            value={values.amount}
            onChange={handleChange}
          />
          {errors.amount && <ErrorMessage message={errors.amount} />}
        </div>

        <div>
          <InputWithIcon
            name="formatedMoney"
            type="text"
            icon={<i className="fa fa-money-bill-wave"></i>}
            placeholder={t(
              'reader.walletPage.content.depositePopup.formatedMoney'
            )}
            value={new Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: 'VND',
            }).format(Number(values.amount))}
            onFocus={(e) => e.target.blur()}
            contentEditable={false}
          />
        </div>

        <div>
          <SelectWithIcon
            name="bankCode"
            icon={<i className="fa-regular fa-credit-card"></i>}
            value={values.bankCode}
            onChange={handleChange}
            border="none"
          >
            <MenuItem value="-1" disabled>
              {t('reader.walletPage.content.depositePopup.bankCode.label')}
            </MenuItem>
            <MenuItem value={String(BankCode.VNPAYQR)}>
              {t('reader.walletPage.content.depositePopup.bankCode.vnpayQl')}
            </MenuItem>
            <MenuItem value={String(BankCode.VNBANK)}>
              {t('reader.walletPage.content.depositePopup.bankCode.vnBank')}
            </MenuItem>
            <MenuItem value={String(BankCode.INTCARD)}>
              {t('reader.walletPage.content.depositePopup.bankCode.intCard')}
            </MenuItem>
          </SelectWithIcon>
          {errors.bankCode && <ErrorMessage message={errors.bankCode} />}
        </div>

        <div className="flex justify-center">
          <IconButton
            icon={
              isLoading ? (
                <img src={LoadingIcon} />
              ) : (
                <i className="fa-solid fa-arrow-right"></i>
              )
            }
            fontSize="1.4rem"
            width={48}
            height={48}
            color="var(--white)"
            bgColor="var(--primary)"
            borderRadius="50%"
            onClick={async () => {
              if (await validateAll()) {
                setRefetch({
                  value: true,
                });
              }
            }}
          />
        </div>
      </div>
    </Popup>
  );
}

export default DepositePopup;
