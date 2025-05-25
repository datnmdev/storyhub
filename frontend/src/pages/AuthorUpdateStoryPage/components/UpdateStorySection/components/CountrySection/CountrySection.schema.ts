import i18n from '@i18n/index';
import { number, object } from 'yup';

export function generateValidateSchema() {
  return object({
    countryId: number()
      .required(i18n.t('validation.required'))
      .notOneOf([-1], i18n.t('validation.required')),
  });
}
