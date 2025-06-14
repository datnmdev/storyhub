import i18n from '@i18n/index';
import { object, string } from 'yup';

export function generateValidateSchema() {
  return object({
    price: string()
      .required(i18n.t('validation.number'))
      .test('is-number-string', i18n.t('validation.number'), (value) =>
        /^\d+$/.test(value || '')
      ),
  });
}
