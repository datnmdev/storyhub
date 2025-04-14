import { ChangeEvent, memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  GenresSectionProps,
  InputData,
  InputError,
} from './GenresSection.type';
import IconButton from '@components/IconButton';
import Button from '@components/Button';
import useFetch from '@hooks/fetch.hook';
import apis from '@apis/index';
import { RequestInit } from '@apis/api.type';
import { useFormValidation } from '@hooks/validate.hook';
import { generateValidateSchema } from './GenresSection.schema';
import ErrorMessage from '@components/ErrorMessage';
import LoadingIcon from '@assets/icons/gifs/loading.gif';
import { useAppDispatch, useAppSelector } from '@hooks/redux.hook';
import toastFeature from '@features/toast';
import { ToastType } from '@constants/toast.constants';
import CreatableSelect from 'react-select/creatable';
import themeFeature from '@features/theme';

function GenresSection({ storyId }: GenresSectionProps) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const themeValue = useAppSelector(themeFeature.themeSelector.selectValue);
  const [isEditable, setEditable] = useState(false);
  const { data: genresData, setRefetch: setReGetGenres } = useFetch(
    apis.genreApi.getGenreWithFilter,
    {
      queries: {
        page: 1,
        limit: Number.MAX_SAFE_INTEGER,
      },
    }
  );
  const {
    data: genresOfStoryData,
    isLoading: isGettingGenresOfStory,
    setRefetch: setReGetGenresOfStory,
  } = useFetch(apis.storyApi.getGenreDetailByStoryId, {
    queries: {
      storyId,
    },
  });
  const [inputDataInit] = useState<InputData>({
    genres: [],
  });
  const [inputData, setInputData] = useState<InputData>(inputDataInit);
  const { values, handleChange, errors, validateAll } = useFormValidation<
    InputData,
    InputError
  >(inputData, generateValidateSchema());
  const [updateGenresReq, setUpdateGenresReq] = useState<RequestInit>({
    params: {
      storyId,
    },
  });
  const {
    data: updateGenresResData,
    isLoading: isUpdatingGenres,
    error: updateGenresError,
    setRefetch: setReUpdateGenres,
  } = useFetch(apis.storyApi.updateGenres, updateGenresReq, false);
  const [_genres, _setGenres] = useState([]);

  useEffect(() => {
    if (!isGettingGenresOfStory) {
      if (genresOfStoryData) {
        _setGenres(
          genresOfStoryData.map((genre: any) => ({
            label: genre.name,
            value: genre.id,
          }))
        );
        setInputData(genresOfStoryData.map((genre: any) => genre.id));
      }
    }
  }, [isGettingGenresOfStory]);

  useEffect(() => {
    setReGetGenres({
      value: true,
    });
    setReGetGenresOfStory({
      value: true,
    });
  }, []);

  useEffect(() => {
    if (values) {
      setUpdateGenresReq({
        ...updateGenresReq,
        body: {
          ...values,
        },
      });
    }
  }, [values]);

  useEffect(() => {
    if (!isUpdatingGenres) {
      if (updateGenresResData) {
        setEditable(false);
        setReGetGenres({
          value: true,
        });
        dispatch(
          toastFeature.toastAction.add({
            type: ToastType.SUCCESS,
            title: t('notification.updateGenresSuccess'),
          })
        );
      } else {
        if (updateGenresError) {
          dispatch(
            toastFeature.toastAction.add({
              type: ToastType.ERROR,
              title: t('notification.updateGenresFailure'),
            })
          );
        }
      }
    }
  }, [isUpdatingGenres]);

  return (
    <div className="relative z-[3]">
      <div className="grow space-y-1">
        <div>
          {t('author.storyManagementPage.uploadStoryPopup.form.genres.title')}
        </div>
        <div className="flex items-center justify-between">
          <div className="grow">
            <CreatableSelect
              isMulti
              isDisabled={!isEditable}
              onChange={(genres: any) => {
                _setGenres(genres);
                handleChange({
                  target: {
                    value: genres.map((e: any) => e.value),
                    name: 'genres',
                  },
                } as ChangeEvent<HTMLInputElement>);
              }}
              options={
                genresData
                  ? genresData[0].map((genre: any) => ({
                      label: genre.name,
                      value: genre.id,
                    }))
                  : []
              }
              value={_genres}
              placeholder={t(
                'author.storyManagementPage.uploadStoryPopup.form.genres.placeholder'
              )}
              noOptionsMessage={() => null}
              formatCreateLabel={(inputValue) =>
                t(
                  'author.storyManagementPage.uploadStoryPopup.form.genres.formatCreateLabel',
                  { inputValue }
                )
              }
              styles={{
                control: (base, state) => ({
                  ...base,
                  minHeight: '42px',
                  borderColor: state.isFocused
                    ? 'var(--primary)'
                    : 'var(--gray)',
                  boxShadow: state.isFocused
                    ? '0 0 0 1px var(--primary)'
                    : 'none',
                  '&:hover': {
                    borderColor: state.isFocused
                      ? 'var(--primary)'
                      : 'var(--gray)',
                  },
                  backgroundColor:
                    themeValue === 'light' ? 'var(--white)' : 'var(--black)',
                }),
                menu: (base) => ({
                  ...base,
                  backgroundColor:
                    themeValue === 'light' ? 'var(--white)' : 'var(--black)',
                  borderRadius: 4,
                  margin: 0,
                  padding: '0 4px',
                  boxShadow:
                    themeValue === 'light'
                      ? '0 0 8px rgb(0, 0, 0, 0.25)'
                      : '0 0 8px rgba(255, 255, 255)',
                }),
                input: (base) => ({
                  ...base,
                  color:
                    themeValue === 'light' ? 'var(--black)' : 'var(--white)',
                }),
                option: (base, state) => ({
                  ...base,
                  backgroundColor: state.isFocused
                    ? 'var(--primary)'
                    : state.isSelected
                      ? 'var(--primary)'
                      : themeValue === 'light'
                        ? 'var(--white)'
                        : 'var(--black)',
                  color:
                    state.isFocused || state.isSelected
                      ? 'white'
                      : themeValue === 'light'
                        ? 'var(--black)'
                        : 'var(--white)',
                  cursor: 'pointer',
                }),
                multiValue: (base) => ({
                  ...base,
                  border: '1px solid var(--gray)',
                  borderRadius: '4px',
                  padding: '2px 4px',
                  backgroundColor:
                    themeValue === 'light' ? 'var(--white)' : 'var(--black)',
                }),
                multiValueLabel: (base) => ({
                  ...base,
                  color:
                    themeValue === 'light' ? 'var(--black)' : 'var(--white)',
                }),
                multiValueRemove: (base) => ({
                  ...base,
                  color: 'var(--gray)',
                  ':hover': {
                    color: 'var(--primary)',
                  },
                }),
              }}
            />
            {errors.genres && <ErrorMessage message={errors.genres} />}

            {isEditable && (
              <div className="flex justify-end mt-2 space-x-2">
                <Button
                  onClick={() => {
                    _setGenres(
                      genresOfStoryData
                        ? genresOfStoryData.map((genre: any) => ({
                            label: genre.name,
                            value: genre.id,
                          }))
                        : []
                    );
                    setInputData({
                      genres: genresOfStoryData
                        ? genresOfStoryData.map((genre: any) => genre.id)
                        : inputDataInit.genres,
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
                      setReUpdateGenres({
                        value: true,
                      });
                    }
                  }}
                >
                  {isUpdatingGenres ? (
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

export default memo(GenresSection);
