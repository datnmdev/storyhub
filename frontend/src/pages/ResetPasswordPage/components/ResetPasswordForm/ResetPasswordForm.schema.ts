import i18n from '@i18n/index';
import { object, ref, string } from 'yup';

export function generateValidateSchema() {
  return object({
    password: string()
      .matches(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{8,}$/,
        i18n.t('validation.password')
      )
      .required(i18n.t('validation.required')),
    repeatPassword: string()
      .matches(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{8,}$/,
        i18n.t('validation.password')
      )
      .oneOf([ref('password')], i18n.t('validation.repeatPassword'))
      .required(i18n.t('validation.required')),
  });
}
