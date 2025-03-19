import { ChangeEvent, useEffect, useState } from 'react';
import { Schema } from 'yup';
import { useTranslation } from 'react-i18next';
import { SelectChangeEvent } from '@mui/material';

export interface InputData {
  [key: string]: any;
}

export interface InputError {
  [key: string]: any;
}

export function useFormValidation<D extends InputData, E extends InputError>(
  initialValues: D,
  validationSchema: Schema
) {
  const { i18n } = useTranslation();
  const [values, setValues] = useState<D>(initialValues);
  const [errors, setErrors] = useState<E>({} as E);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement> | SelectChangeEvent<string>
  ) => {
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
      const cpError = Object.assign({}, values);
      Object.keys(cpError).forEach((key) => {
        validationSchema
          .validateAt(key, {
            ...values,
            [key]: (values as InputData)[key],
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
          [key]: (values as InputData)[key],
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
}
