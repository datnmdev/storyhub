import i18n from '@i18n/index';
import { object, string } from 'yup';

export function generateValidateSchema() {
  return object({
    content: string().required(i18n.t('validation.required')),
  });
}
