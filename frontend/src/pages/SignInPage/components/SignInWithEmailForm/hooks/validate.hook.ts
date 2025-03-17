import { ChangeEvent, useEffect, useState } from 'react';
import { Schema } from 'yup';
import { InputError, InputData } from '../type';
import { useTranslation } from 'react-i18next';

export const useFormValidation = (
  initialValues: InputData,
  validationSchema: Schema
) => {
  const { i18n } = useTranslation();
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<InputError>({});

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));

    validationSchema
      .validateAt(name, {
        ...values,
        [name]: value,
      })
      .then(() => {
        setErrors((prev) => ({
          ...prev,
          [name]: undefined,
        }));
      })
      .catch((err) => {
        setErrors((prev) => ({
          ...prev,
          [name]: err.message,
        }));
      });
  };

  const validateAll = async () => {
    try {
      await validationSchema.validate(values, {
        abortEarly: false,
      });
      return true;
    } catch (err: any) {
      return false;
    }
  };

  useEffect(() => {
    const cpError = Object.assign({}, errors);
    Object.keys(cpError).forEach((key) => {
      validationSchema
        .validateAt(key, {
          ...values,
          [key]: (values as InputData & { [key: string]: string })[key],
        })
        .then(() => {
          setErrors((prev) => ({
            ...prev,
            [key]: undefined,
          }));
        })
        .catch((err) => {
          setErrors((prev) => ({
            ...prev,
            [key]: err.message,
          }));
        });
    });
  }, [i18n.language]);

  return { values, errors, handleChange, validateAll };
};
