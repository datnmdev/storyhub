import { memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  CountrySectionProps,
  InputData,
  InputError,
} from './CountrySection.type';
import IconButton from '@components/IconButton';
import Button from '@components/Button';
import { Story } from '@pages/ReaderHomePage/components/NewUpdateStorySection/NewUpdateStorySection.type';
import useFetch from '@hooks/fetch.hook';
import apis from '@apis/index';
import { RequestInit } from '@apis/api.type';
import { useFormValidation } from '@hooks/validate.hook';
import { generateValidateSchema } from './CountrySection.schema';
import ErrorMessage from '@components/ErrorMessage';
import LoadingIcon from '@assets/icons/gifs/loading.gif';
import { useAppDispatch } from '@hooks/redux.hook';
import toastFeature from '@features/toast';
import { ToastType } from '@constants/toast.constants';
import Select from '@components/Select';
import MenuItem from '@components/MenuItem';
import { Country } from '@apis/country';

function CountrySection({ storyId }: CountrySectionProps) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [isEditable, setEditable] = useState(false);
  const {
    data: storyData,
    isLoading: isGettingStory,
    setRefetch: setReGetStory,
  } = useFetch<[Story[], number]>(apis.storyApi.getStoryWithFilter, {
    queries: {
      id: storyId,
      page: 1,
      limit: 1,
    },
  });
  const [inputDataInit] = useState<InputData>({
    countryId: '-1',
  });
  const [inputData, setInputData] = useState<InputData>(inputDataInit);
  const { values, handleChange, errors, validateAll } = useFormValidation<
    InputData,
    InputError
  >(inputData, generateValidateSchema());
  const [updateStoryReq, setUpdateStoryReq] = useState<RequestInit>({
    params: {
      storyId,
    },
  });
  const {
    data: updateStoryResData,
    isLoading: isUpdatingStory,
    error: updateStoryError,
    setRefetch: setReUpdateStory,
  } = useFetch(apis.storyApi.updateStory, updateStoryReq, false);
  const {
    data: countriesData,
    isLoading: isGettingCountries,
    setRefetch: setReGetCountries,
  } = useFetch<[Country[], number]>(apis.countryApi.getCountries, {
    queries: {
      page: 1,
      limit: Number.MAX_SAFE_INTEGER,
    },
  });

  useEffect(() => {
    if (!isGettingStory) {
      if (storyData) {
        setInputData({
          countryId: String(storyData[0][0].countryId),
        });
      }
    }
  }, [isGettingStory]);

  useEffect(() => {
    setReGetStory({
      value: true,
    });
    setReGetCountries({
      value: true,
    });
  }, []);

  useEffect(() => {
    if (values) {
      setUpdateStoryReq({
        ...updateStoryReq,
        body: {
          ...values,
        },
      });
    }
  }, [values]);

  useEffect(() => {
    if (!isUpdatingStory) {
      if (updateStoryResData) {
        setEditable(false);
        setReGetStory({
          value: true,
        });
        dispatch(
          toastFeature.toastAction.add({
            type: ToastType.SUCCESS,
            title: t('notification.updateCountrySuccess'),
          })
        );
      } else {
        if (updateStoryError) {
          dispatch(
            toastFeature.toastAction.add({
              type: ToastType.ERROR,
              title: t('notification.updateCountryFailure'),
            })
          );
        }
      }
    }
  }, [isUpdatingStory]);

  return (
    <div>
      <div className="grow space-y-1">
        <div>
          {t('author.storyManagementPage.uploadStoryPopup.form.country.title')}
        </div>
        <div className="flex items-center justify-between">
          <div className="grow">
            <Select
              key={1}
              name="countryId"
              value={values.countryId}
              onChange={(e) => handleChange(e)}
              readOnly={!isEditable}
            >
              <MenuItem value="-1" disabled>
                {t(
                  'author.storyManagementPage.uploadStoryPopup.form.country.title'
                )}
              </MenuItem>
              {!isGettingCountries &&
                countriesData &&
                countriesData[0].map((country) => {
                  return (
                    <MenuItem key={country.id} value={String(country.id)}>
                      {country.name}
                    </MenuItem>
                  );
                })}
            </Select>
            {errors.countryId && <ErrorMessage message={errors.countryId} />}

            {isEditable && (
              <div className="flex justify-end mt-2 space-x-2">
                <Button
                  onClick={() => {
                    setInputData({
                      countryId: storyData
                        ? String(storyData[0][0].countryId)
                        : String(inputDataInit.countryId),
                    });
                    setEditable(false);
                  }}
                >
                  {t('btns.cancel')}
                </Button>
                <Button
                  disabled={errors.title ? true : false}
                  onClick={async () => {
                    if (await validateAll()) {
                      setReUpdateStory({
                        value: true,
                      });
                    }
                  }}
                >
                  {isUpdatingStory ? (
                    <div className="flex items-center space-x-0.5">
                      <img
                        width={32}
                        height={32}
                        src={LoadingIcon}
                        alt="Loading"
                      />

                      <span>{t('loading.save')}</span>
                    </div>
                  ) : (
                    t('btns.save')
                  )}
                </Button>
              </div>
            )}
          </div>

          <IconButton
            sx={{
              visibility: isEditable ? 'hidden' : 'visible',
            }}
            icon={<i className="fa-solid fa-pen text-[1.2rem] p-4"></i>}
            onClick={() => setEditable(true)}
          />
        </div>
      </div>
    </div>
  );
}

export default memo(CountrySection);
