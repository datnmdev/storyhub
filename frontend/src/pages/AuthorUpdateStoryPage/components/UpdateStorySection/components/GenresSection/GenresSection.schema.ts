import i18n from '@i18n/index';
import { array, number, object } from 'yup';

export function generateValidateSchema() {
  return object({
    genres: array().of(number()).min(1, i18n.t('validation.required')),
  });
}
