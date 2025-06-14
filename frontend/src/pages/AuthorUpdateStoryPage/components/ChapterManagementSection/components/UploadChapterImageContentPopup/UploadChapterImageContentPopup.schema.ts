import i18n from '@i18n/index';
import { array, number, object, string } from 'yup';

export function generateValidateSchema() {
  return object({
    name: string().required(i18n.t('validation.required')),
    imageContents: array()
      .of(
        object({
          order: number().required(),
          path: string().required(),
        })
      )
      .required(i18n.t('validation.required')),
  });
}
