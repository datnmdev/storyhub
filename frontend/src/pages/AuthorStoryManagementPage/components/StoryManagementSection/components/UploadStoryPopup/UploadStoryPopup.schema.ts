import { StoryType } from '@constants/story.constants';
import i18n from '@i18n/index';
import { array, number, object, string } from 'yup';

export function generateValidateSchema() {
  return object({
    title: string().required(i18n.t('validation.required')),
    alias: array().of(string()).min(1, i18n.t('validation.required')),
    description: string().required(i18n.t('validation.required')),
    type: string()
      .required(i18n.t('validation.required'))
      .oneOf(
        [StoryType.COMIC, StoryType.NOVEL],
        i18n.t('validation.storyType')
      ),
    notes: string(),
    coverImage: string().required(i18n.t('validation.required')),
    countryId: number()
      .required(i18n.t('validation.required'))
      .notOneOf([-1], i18n.t('validation.required')),
    price: string()
      .required(i18n.t('validation.number'))
      .test('is-number-string', i18n.t('validation.number'), (value) =>
        /^\d+$/.test(value || '')
      ),
    genres: array().of(number()).min(1, i18n.t('validation.required')),
  });
}
