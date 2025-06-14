import i18n from '@i18n/index';
import { array, object, string } from 'yup';

export function generateValidateSchema() {
  return object({
    alias: array().of(string()).min(1, i18n.t('validation.required')),
  });
}
