import i18n from '@i18n/index';
import { object, string } from 'yup';

export function generateValidateSchema() {
  return object({
    otp: string()
      .matches(/^\d+$/, i18n.t('validation.numberString'))
      .length(6, i18n.t('validation.length', { length: 6 }))
      .required(i18n.t('validation.required')),
  });
}
