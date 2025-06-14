import { Gender } from '@constants/user.constants';
import i18n from '@i18n/index';
import { date, object, string } from 'yup';

export function generateValidateSchema() {
  return object({
    name: string().required(i18n.t('validation.required')),
    dob: date()
      .test('dob', i18n.t('validation.dob'), (value) => {
        if (value === undefined) {
          return true;
        }
        if (value instanceof Date) {
          return value.getTime() < Date.now();
        }
        return false;
      })
      .optional(),
    gender: string()
      .oneOf(
        [Gender.MALE, Gender.FEMALE, Gender.ORTHER, '-1'],
        i18n.t('validation.gender')
      )
      .optional(),
    phone: string()
      .optional()
      .test('phone', i18n.t('validation.phone'), function (value) {
        if (!value || value.trim() === '') {
          return true;
        }
        return /^[0-9]{10,11}$/.test(value);
      }),
  });
}
