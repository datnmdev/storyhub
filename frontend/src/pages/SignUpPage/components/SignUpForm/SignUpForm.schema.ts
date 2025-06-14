import { Gender, Role } from '@constants/user.constants';
import i18n from '@i18n/index';
import { date, object, ref, string } from 'yup';

export function generateValidateSchema() {
  return object({
    type: string()
      .oneOf([Role.READER, Role.AUTHOR], i18n.t('validation.required'))
      .required(i18n.t('validation.required')),
    email: string()
      .email(i18n.t('validation.email'))
      .required(i18n.t('validation.required')),
    name: string().required(i18n.t('validation.required')),
    dob: date()
      .test('dob', i18n.t('validation.dob'), (value) => {
        if (value instanceof Date) {
          return value.getTime() < Date.now();
        }
        return false;
      })
      .required(i18n.t('validation.required')),
    gender: string()
      .oneOf(
        [Gender.MALE, Gender.FEMALE, Gender.ORTHER],
        i18n.t('validation.required')
      )
      .required(i18n.t('validation.required')),
    phone: string()
      .matches(/^[0-9]{10,11}$/, i18n.t('validation.phone'))
      .required(i18n.t('validation.required')),
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
    countryId: string()
      .notOneOf(['-1'], i18n.t('validation.required'))
      .required(i18n.t('validation.required')),
  });
}
