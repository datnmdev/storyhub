import apis from '@apis/index';
import Button from '@components/Button';
import MenuItem from '@components/MenuItem';
import Select from '@components/Select';
import useFetch from '@hooks/fetch.hook';
import { Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import { memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FilterFormSectionProps,
  FilterInputData,
} from './FilterFormSection.type';
import { StoryStatus, StoryType } from '@constants/story.constants';

const defaultInputData: FilterInputData = {
  authorId: undefined,
  status: JSON.stringify([StoryStatus.RELEASING, StoryStatus.COMPLETED]),
  countryId: undefined,
  type: JSON.stringify([StoryType.COMIC, StoryType.NOVEL]),
  orderBy: JSON.stringify([
    ['created_at', 'DESC'],
    ['id', 'DESC'],
  ]),
  genres: undefined,
  page: 1,
  limit: 24,
};

function FilterFormSection({ onChange, onSubmit }: FilterFormSectionProps) {
  const { t } = useTranslation();
  const { data: authors } = useFetch(apis.authApi.getAllAuthor);
  const { data: countries } = useFetch(apis.countryApi.getCountries, {
    queries: {
      page: 1,
      limit: Number.MAX_SAFE_INTEGER,
    },
  });
  const { data: genresData } = useFetch(apis.genreApi.getGenreWithFilter, {
    queries: {
      page: 1,
      limit: Number.MAX_SAFE_INTEGER,
    },
  });
  const [isHidden, setHidden] = useState(false);
  const [inputData, setInputData] = useState<FilterInputData>(defaultInputData);
  const [selectedValues, setSelectedValues] = useState<number[]>([]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    if (checked) {
      setSelectedValues((prev) => [...prev, Number(value)]);
    } else {
      setSelectedValues((prev) =>
        prev.filter((item) => item !== Number(value))
      );
    }
  };

  useEffect(() => {
    setInputData({
      ...inputData,
      genres:
        selectedValues.length > 0 ? JSON.stringify(selectedValues) : undefined,
    });
  }, [selectedValues]);

  useEffect(() => {
    if (inputData.genres === undefined) {
      setSelectedValues([]);
    }
  }, [inputData.genres]);

  useEffect(() => {
    if (onChange) {
      onChange(inputData);
    }
  }, [inputData]);

  return (
    <div>
      <div className="flex justify-between items-center">
        <h3 className="text-[1.4rem] font-semibold">
          {t('reader.storyFilterPage.filterFormSection.title')}
        </h3>

        <Button width={80} height={32} onClick={() => setHidden(!isHidden)}>
          {isHidden
            ? t('reader.storyFilterPage.filterFormSection.btn.visibleBtn')
            : t('reader.storyFilterPage.filterFormSection.btn.hideBtn')}
        </Button>
      </div>

      {!isHidden && (
        <div className="mt-4">
          <div>
            <div className="grid desktop:grid-cols-3 tablet:grid-cols-2 mobile:grid-cols-1 gap-x-16 gap-y-4">
              <div className="flex items-center justify-between">
                <div className="w-[160px] font-[450]">
                  {t('reader.storyFilterPage.filterFormSection.form.author')}
                </div>

                <div className="grow shrink-0">
                  <Select
                    value={String(inputData.authorId)}
                    onChange={(e) => {
                      if (e.target.value === defaultInputData.authorId) {
                        setInputData({
                          ...inputData,
                          authorId: defaultInputData.authorId,
                        });
                      } else {
                        setInputData({
                          ...inputData,
                          authorId: e.target.value,
                        });
                      }
                    }}
                  >
                    <MenuItem
                      value={String(defaultInputData.authorId)}
                      selected={
                        defaultInputData.authorId === inputData.authorId
                      }
                    >
                      {t('reader.storyFilterPage.filterFormSection.form.all')}
                    </MenuItem>

                    {authors &&
                      authors.map((author: any) => {
                        return (
                          <MenuItem
                            key={author.id}
                            value={String(author.id)}
                            selected={String(author.id) === inputData.authorId}
                          >
                            {author.userProfile.name}
                          </MenuItem>
                        );
                      })}
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="w-[160px] font-[450]">
                  {t(
                    'reader.storyFilterPage.filterFormSection.form.status.label'
                  )}
                </div>

                <div className="grow shrink-0">
                  <Select
                    value={inputData.status}
                    onChange={(e) =>
                      setInputData({
                        ...inputData,
                        status: e.target.value,
                      })
                    }
                  >
                    <MenuItem
                      value={defaultInputData.status}
                      selected={defaultInputData.status === inputData.status}
                    >
                      {t('reader.storyFilterPage.filterFormSection.form.all')}
                    </MenuItem>

                    <MenuItem
                      value={JSON.stringify([StoryStatus.RELEASING])}
                      selected={
                        inputData.status ===
                        JSON.stringify([StoryStatus.RELEASING])
                      }
                    >
                      {t(
                        'reader.storyFilterPage.filterFormSection.form.status.publishing'
                      )}
                    </MenuItem>

                    <MenuItem
                      value={JSON.stringify([StoryStatus.COMPLETED])}
                      selected={
                        inputData.status ===
                        JSON.stringify([StoryStatus.COMPLETED])
                      }
                    >
                      {t(
                        'reader.storyFilterPage.filterFormSection.form.status.finished'
                      )}
                    </MenuItem>
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="w-[160px] font-[450]">
                  {t('reader.storyFilterPage.filterFormSection.form.country')}
                </div>

                <div className="grow shrink-0">
                  <Select
                    value={String(inputData.countryId)}
                    onChange={(e) => {
                      if (e.target.value === defaultInputData.countryId) {
                        setInputData({
                          ...inputData,
                          countryId: defaultInputData.countryId,
                        });
                      } else {
                        setInputData({
                          ...inputData,
                          countryId: e.target.value,
                        });
                      }
                    }}
                  >
                    <MenuItem
                      value={String(defaultInputData.countryId)}
                      selected={
                        defaultInputData.countryId ===
                        defaultInputData.countryId
                      }
                    >
                      {t('reader.storyFilterPage.filterFormSection.form.all')}
                    </MenuItem>

                    {countries &&
                      countries[0].map((country: any) => {
                        return (
                          <MenuItem
                            key={country.id}
                            value={String(country.id)}
                            selected={
                              String(country.id) === inputData.countryId
                            }
                          >
                            {country.name}
                          </MenuItem>
                        );
                      })}
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="w-[160px] font-[450]">
                  {t(
                    'reader.storyFilterPage.filterFormSection.form.type.label'
                  )}
                </div>

                <div className="grow shrink-0">
                  <Select
                    value={inputData.type}
                    onChange={(e) =>
                      setInputData({
                        ...inputData,
                        type: e.target.value,
                      })
                    }
                  >
                    <MenuItem
                      value={defaultInputData.type}
                      selected={defaultInputData.type === inputData.type}
                    >
                      {t('reader.storyFilterPage.filterFormSection.form.all')}
                    </MenuItem>

                    <MenuItem
                      value={JSON.stringify([StoryType.COMIC])}
                      selected={
                        JSON.stringify([StoryType.COMIC]) === inputData.type
                      }
                    >
                      {t(
                        'reader.storyFilterPage.filterFormSection.form.type.comic'
                      )}
                    </MenuItem>

                    <MenuItem
                      value={JSON.stringify([StoryType.NOVEL])}
                      selected={
                        JSON.stringify([StoryType.NOVEL]) === inputData.type
                      }
                    >
                      {t(
                        'reader.storyFilterPage.filterFormSection.form.type.novel'
                      )}
                    </MenuItem>
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="w-[160px] font-[450]">
                  {t(
                    'reader.storyFilterPage.filterFormSection.form.orderBy.label'
                  )}
                </div>

                <div className="grow shrink-0">
                  <Select
                    value={inputData.orderBy}
                    onChange={(e) =>
                      setInputData({
                        ...inputData,
                        orderBy: e.target.value,
                      })
                    }
                  >
                    <MenuItem
                      value={defaultInputData.orderBy}
                      selected={defaultInputData.orderBy === inputData.orderBy}
                    >
                      {t(
                        'reader.storyFilterPage.filterFormSection.form.orderBy.datePostedDescending'
                      )}
                    </MenuItem>

                    <MenuItem
                      value={JSON.stringify([
                        ['created_at', 'ASC'],
                        ['id', 'ASC'],
                      ])}
                      selected={
                        JSON.stringify([
                          ['created_at', 'ASC'],
                          ['id', 'ASC'],
                        ]) === inputData.orderBy
                      }
                    >
                      {t(
                        'reader.storyFilterPage.filterFormSection.form.orderBy.datePostedAsscending'
                      )}
                    </MenuItem>

                    <MenuItem
                      value={JSON.stringify([
                        ['updated_at', 'DESC'],
                        ['id', 'DESC'],
                      ])}
                      selected={
                        JSON.stringify([
                          ['updated_at', 'DESC'],
                          ['id', 'DESC'],
                        ]) === inputData.orderBy
                      }
                    >
                      {t(
                        'reader.storyFilterPage.filterFormSection.form.orderBy.dateUpdatedDescending'
                      )}
                    </MenuItem>

                    <MenuItem
                      value={JSON.stringify([
                        ['updated_at', 'ASC'],
                        ['id', 'ASC'],
                      ])}
                      selected={
                        JSON.stringify([
                          ['updated_at', 'ASC'],
                          ['id', 'ASC'],
                        ]) === inputData.orderBy
                      }
                    >
                      {t(
                        'reader.storyFilterPage.filterFormSection.form.orderBy.dateUpdatedAsscending'
                      )}
                    </MenuItem>
                  </Select>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <div className="font-[450] leading-[40px]">
                {t('reader.storyFilterPage.filterFormSection.form.genre')}
              </div>

              <div>
                <FormGroup>
                  <div className="grid desktop:grid-cols-6 tablet:grid-cols-4 mobile:grid-cols-2">
                    {genresData &&
                      genresData[0].map((genre: any) => {
                        return (
                          <div
                            key={genre.id}
                            className="flex items-center leading-2"
                          >
                            <FormControlLabel
                              sx={{
                                '& .MuiFormControlLabel-label': {
                                  fontWeight: 400,
                                },
                                '& .MuiSvgIcon-root': {
                                  fontSize: 24,
                                },
                              }}
                              control={
                                <Checkbox
                                  value={String(genre.id)}
                                  sx={{
                                    color: 'var(--gray)',
                                    '&.Mui-checked': {
                                      color: 'var(--primary)',
                                    },
                                  }}
                                  checked={selectedValues.includes(genre.id)}
                                  onChange={handleChange}
                                />
                              }
                              label={genre.name}
                            />
                          </div>
                        );
                      })}
                  </div>
                </FormGroup>
              </div>
            </div>
          </div>

          <div className="flex justify-center items-center space-x-4 mt-4">
            <Button
              bgColor="red"
              onClick={() => setInputData(defaultInputData)}
            >
              {t('reader.storyFilterPage.filterFormSection.btn.resetBtn')}
            </Button>

            <Button bgColor="#8bc24a" onClick={onSubmit}>
              {t('reader.storyFilterPage.filterFormSection.btn.submitBtn')}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(FilterFormSection);
