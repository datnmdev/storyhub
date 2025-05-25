import Popup from '@components/Popup';
import {
  InputData,
  InputError,
  UploadStoryPopupProps,
} from './UploadStoryPopup.type';
import { useTranslation } from 'react-i18next';
import CoverImageUploader from '@components/CoverImageUploader';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useFormValidation } from '@hooks/validate.hook';
import { generateValidateSchema } from './UploadStoryPopup.schema';
import ErrorMessage from '@components/ErrorMessage';
import Input from '@components/Input';
import CreatableSelect from 'react-select/creatable';
import { useAppDispatch, useAppSelector } from '@hooks/redux.hook';
import themeFeature from '@features/theme';
import TinyMceEditor from '@components/TinyMceEditor';
import Select from '@components/Select';
import MenuItem from '@components/MenuItem';
import { StoryType } from '@constants/story.constants';
import useFetch from '@hooks/fetch.hook';
import { Country } from '@apis/country';
import apis from '@apis/index';
import { Genre } from '@apis/genre';
import Button from '@components/Button';
import { RequestInit } from '@apis/api.type';
import toastFeature from '@features/toast';
import { ToastType } from '@constants/toast.constants';
import Loading from '@components/Loading';

function UploadStoryPopup(props: UploadStoryPopupProps) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const themeValue = useAppSelector(themeFeature.themeSelector.selectValue);
  const [inputDataInit, setInputDataInit] = useState<InputData>({
    title: '',
    alias: [],
    description: '',
    type: '-1',
    notes: '',
    coverImage: '',
    countryId: '-1',
    price: '0',
    genres: [],
  });
  const [inputData, setInputData] = useState<InputData>(inputDataInit);
  const { values, handleChange, errors, validateAll } = useFormValidation<
    InputData,
    InputError
  >(inputData, generateValidateSchema());
  const [_alias, _setAlias] = useState([]);
  const { data: countriesData, isLoading: isGettingCountries } = useFetch<
    [Country[], number]
  >(apis.countryApi.getCountries, {
    queries: {
      page: 1,
      limit: Number.MAX_SAFE_INTEGER,
    },
  });
  const [_genres, _setGenres] = useState([]);
  const { data: genresData } = useFetch<[Genre[], number]>(
    apis.genreApi.getGenreWithFilter,
    {
      queries: {
        page: 1,
        limit: Number.MAX_SAFE_INTEGER,
      },
    }
  );
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [getPreUploadUrlRequest, setGetPreUploadUrlRequest] =
    useState<RequestInit>();
  const {
    data: getPreUploadAvatarUrlResData,
    isLoading: isGetingPreUploadAvatarUrl,
    setRefetch: setReGetPreUploadAvatarUrl,
  } = useFetch(apis.uploadApi.getUploadUrl, getPreUploadUrlRequest, false);
  const [uploadAvatarRequest, setUploadAvatarRequest] = useState<RequestInit>();
  const { setRefetch: setReUploadAvatar } = useFetch(
    apis.uploadApi.upload,
    uploadAvatarRequest,
    false
  );
  const [uploadStoryReq, setUploadStoryReq] = useState<RequestInit>();
  const {
    data: uploadStoryResData,
    isLoading: isUploadingStory,
    error: uploadStoryError,
    setRefetch: setReUploadStory,
  } = useFetch(apis.storyApi.uploadStory, uploadStoryReq, false);
  const descriptionRef = useRef<any>(null);
  const notesRef = useRef<any>(null);

  useEffect(() => {
    if (coverImageFile) {
      setGetPreUploadUrlRequest({
        queries: {
          fileType: coverImageFile.type,
        },
      });
    }
  }, [coverImageFile]);

  useEffect(() => {
    if (getPreUploadUrlRequest) {
      setReGetPreUploadAvatarUrl({
        value: true,
      });
    }
  }, [getPreUploadUrlRequest]);

  useEffect(() => {
    if (!isGetingPreUploadAvatarUrl) {
      if (getPreUploadAvatarUrlResData) {
        setUploadAvatarRequest({
          uri: getPreUploadAvatarUrlResData.preUploadUrl,
          body: coverImageFile,
          headers: {
            'Content-Type': coverImageFile?.type || '',
          },
        });
      }
    }
  }, [isGetingPreUploadAvatarUrl]);

  useEffect(() => {
    if (coverImageFile && getPreUploadAvatarUrlResData) {
      handleChange({
        target: {
          name: 'coverImage',
          value: getPreUploadAvatarUrlResData.fileKey,
        },
      } as ChangeEvent<HTMLInputElement>);
    }
  }, [coverImageFile, getPreUploadAvatarUrlResData]);

  useEffect(() => {
    if (uploadAvatarRequest) {
      setReUploadAvatar({
        value: true,
      });
    }
  }, [uploadAvatarRequest]);

  useEffect(() => {
    if (inputDataInit) {
      setInputData(inputDataInit);
    }
  }, [inputDataInit]);

  useEffect(() => {
    if (uploadStoryReq) {
      setReUploadStory({
        value: true,
      });
    }
  }, [uploadStoryReq]);

  useEffect(() => {
    if (!isUploadingStory) {
      if (uploadStoryResData !== null) {
        dispatch(
          toastFeature.toastAction.add({
            type: ToastType.SUCCESS,
            title: t('notification.uploadStorySuccess'),
          })
        );
        if (props.setRefetchStoryList) {
          props.setRefetchStoryList({
            value: true,
          });
        }
        setCoverImageFile(() => null);
        descriptionRef?.current?.setContent('');
        notesRef?.current?.setContent('');
        setInputDataInit({
          ...inputDataInit,
        });
      } else {
        if (uploadStoryError) {
          dispatch(
            toastFeature.toastAction.add({
              type: ToastType.ERROR,
              title: t('notification.uploadStoryFailure'),
            })
          );
        }
      }
    }
  }, [isUploadingStory]);

  useEffect(() => {
    if (values.alias.length === 0) {
      _setAlias([]);
    }
  }, [values.alias]);

  useEffect(() => {
    if (values.genres.length === 0) {
      _setGenres([]);
    }
  }, [values.genres]);

  return (
    <Popup
      {...props}
      title={t('author.storyManagementPage.uploadStoryPopup.title')}
      width={1000}
      minHeight={620}
    >
      <div className="flex justify-between items-start space-x-4 my-4">
        <div className="grow space-y-4">
          <div>
            <div className="space-y-1">
              <div>
                {t(
                  'author.storyManagementPage.uploadStoryPopup.form.title.title'
                )}
              </div>
              <Input
                sx={{
                  borderRadius: 4,
                }}
                name="title"
                type="text"
                placeholder={t(
                  'author.storyManagementPage.uploadStoryPopup.form.title.placeholder'
                )}
                value={values.title}
                onChange={handleChange}
              />
            </div>
            {errors.title && <ErrorMessage message={errors.title} />}
          </div>

          <div>
            <div className="space-y-1">
              <div>
                {t(
                  'author.storyManagementPage.uploadStoryPopup.form.alias.title'
                )}
              </div>
              <CreatableSelect
                isMulti
                onChange={(alias: any) => {
                  _setAlias(alias);
                  handleChange({
                    target: {
                      value: alias.map((e: any) => e.value),
                      name: 'alias',
                    },
                  } as ChangeEvent<HTMLInputElement>);
                }}
                options={[]}
                value={_alias}
                placeholder={t(
                  'author.storyManagementPage.uploadStoryPopup.form.alias.placeholder'
                )}
                noOptionsMessage={() => null}
                formatCreateLabel={(inputValue) =>
                  t(
                    'author.storyManagementPage.uploadStoryPopup.form.alias.formatCreateLabel',
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
            </div>
            {errors.alias && <ErrorMessage message={errors.alias} />}
          </div>

          <div>
            <div className="space-y-1">
              <div>
                {t(
                  'author.storyManagementPage.uploadStoryPopup.form.description.title'
                )}
              </div>
              <TinyMceEditor
                placeholder={t(
                  'author.storyManagementPage.uploadStoryPopup.form.description.placeholder'
                )}
                ref={descriptionRef}
                onChange={(value) =>
                  handleChange({
                    target: { name: 'description', value },
                  } as ChangeEvent<HTMLInputElement>)
                }
              />
            </div>
            {errors.description && (
              <ErrorMessage message={errors.description} />
            )}
          </div>

          <div>
            <div className="space-y-1">
              <div>
                {t(
                  'author.storyManagementPage.uploadStoryPopup.form.type.title'
                )}
              </div>
              <Select
                name="type"
                value={values.type}
                onChange={(e) => handleChange(e)}
              >
                <MenuItem value="-1" disabled>
                  {t(
                    'author.storyManagementPage.uploadStoryPopup.form.type.title'
                  )}
                </MenuItem>
                <MenuItem value={String(StoryType.NOVEL)}>
                  {t(
                    'author.storyManagementPage.uploadStoryPopup.form.type.values.novel'
                  )}
                </MenuItem>
                <MenuItem value={String(StoryType.COMIC)}>
                  {t(
                    'author.storyManagementPage.uploadStoryPopup.form.type.values.comic'
                  )}
                </MenuItem>
              </Select>
            </div>
            {errors.type && <ErrorMessage message={errors.type} />}
          </div>

          <div>
            <div className="space-y-1">
              <div>
                {t(
                  'author.storyManagementPage.uploadStoryPopup.form.country.title'
                )}
              </div>
              <Select
                key={1}
                name="countryId"
                value={values.countryId}
                onChange={(e) => handleChange(e)}
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
            </div>
            {errors.countryId && <ErrorMessage message={errors.countryId} />}
          </div>

          <div className="relative z-[3]">
            <div className="space-y-1">
              <div>
                {t(
                  'author.storyManagementPage.uploadStoryPopup.form.genres.title'
                )}
              </div>
              <CreatableSelect
                isMulti
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
                    ? genresData[0].map((genre) => ({
                        value: genre.id,
                        label: genre.name,
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
            </div>
            {errors.genres && <ErrorMessage message={errors.genres} />}
          </div>

          <div>
            <div className="space-y-1">
              <div>
                {t(
                  'author.storyManagementPage.uploadStoryPopup.form.price.title'
                )}
              </div>
              <Input
                sx={{
                  borderRadius: 4,
                }}
                name="price"
                type="number"
                placeholder={t(
                  'author.storyManagementPage.uploadStoryPopup.form.price.placeholder'
                )}
                value={values.price}
                onChange={handleChange}
              />
            </div>
            {errors.price && <ErrorMessage message={errors.price} />}
          </div>

          <div>
            <div className="space-y-1">
              <div>
                {t(
                  'author.storyManagementPage.uploadStoryPopup.form.notes.title'
                )}
              </div>
              <TinyMceEditor
                placeholder={t(
                  'author.storyManagementPage.uploadStoryPopup.form.notes.placeholder'
                )}
                ref={notesRef}
                onChange={(value) =>
                  handleChange({
                    target: { name: 'notes', value },
                  } as ChangeEvent<HTMLInputElement>)
                }
              />
            </div>
            {errors.notes && <ErrorMessage message={errors.notes} />}
          </div>
        </div>

        <div className="shrink-0 flex items-center max-w-[320px]">
          <div>
            <CoverImageUploader
              previewUrl={
                coverImageFile !== null
                  ? URL.createObjectURL(coverImageFile)
                  : undefined
              }
              value={coverImageFile}
              onChange={(file) => setCoverImageFile(file)}
            />
            <div className="flex justify-center items-center">
              {errors.coverImage && (
                <ErrorMessage message={errors.coverImage} />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2 mt-4">
        <Button
          onClick={async () => {
            if (await validateAll()) {
              setUploadStoryReq({
                body: {
                  ...values,
                  type: values.type === '-1' ? undefined : values.type,
                  countryId:
                    values.countryId == '-1' ? undefined : values.countryId,
                },
              });
            }
          }}
        >
          {t('author.storyManagementPage.uploadStoryPopup.btns.uploadStoryBtn')}
        </Button>

        <Button
          onClick={() => {
            setCoverImageFile(() => null);
            descriptionRef?.current?.setContent('');
            notesRef?.current?.setContent('');
            setInputDataInit({
              ...inputDataInit,
            });
          }}
          bgColor="red"
        >
          {t('author.storyManagementPage.uploadStoryPopup.btns.resetBtn')}
        </Button>
      </div>

      {isUploadingStory && (
        <Loading
          level="page"
          backgroundVisible="frog"
          message={t('loading.uploadStory')}
        />
      )}
    </Popup>
  );
}

export default UploadStoryPopup;
