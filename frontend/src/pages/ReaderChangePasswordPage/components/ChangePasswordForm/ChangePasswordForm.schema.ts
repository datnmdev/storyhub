import i18n from '@i18n/index';
import { object, ref, string } from 'yup';

export function generateValidateSchema() {
  return object({
    oldPassword: string()
      .matches(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{8,}$/,
        i18n.t('validation.password')
      )
      .required(i18n.t('validation.required')),
    newPassword: string()
      .matches(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{8,}$/,
        i18n.t('validation.password')
      )
      .required(i18n.t('validation.required')),
    repeatNewPassword: string()
      .matches(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{8,}$/,
        i18n.t('validation.password')
      )
      .oneOf([ref('newPassword')], i18n.t('validation.repeatPassword'))
      .required(i18n.t('validation.required')),
  });
}
