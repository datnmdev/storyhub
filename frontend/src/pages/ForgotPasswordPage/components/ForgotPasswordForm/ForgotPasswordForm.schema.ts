import i18n from '@i18n/index';
import { object, string } from 'yup';

export function generateValidateSchema() {
  return object({
    email: string()
      .email(i18n.t('validation.email'))
      .required(i18n.t('validation.required')),
  });
}
