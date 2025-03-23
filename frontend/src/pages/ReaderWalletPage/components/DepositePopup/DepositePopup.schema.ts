import { BankCode } from '@constants/payment.constant';
import i18n from '@i18n/index';
import { number, object, string } from 'yup';

export function generateValidateSchema() {
  return object({
    amount: number()
      .typeError(i18n.t('validation.number'))
      .min(10000, i18n.t('validation.amount'))
      .required(i18n.t('validation.required')),
    bankCode: string()
      .oneOf(
        [BankCode.VNPAYQR, BankCode.VNBANK, BankCode.INTCARD],
        i18n.t('validation.bankCode')
      )
      .required(i18n.t('validation.required')),
  });
}
