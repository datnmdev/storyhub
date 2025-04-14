import { ChangeEvent, memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AliasSectionProps, InputData, InputError } from './AliasSection.type';
import IconButton from '@components/IconButton';
import Button from '@components/Button';
import useFetch from '@hooks/fetch.hook';
import apis from '@apis/index';
import { RequestInit } from '@apis/api.type';
import { useFormValidation } from '@hooks/validate.hook';
import { generateValidateSchema } from './AliasSection.schema';
import ErrorMessage from '@components/ErrorMessage';
import LoadingIcon from '@assets/icons/gifs/loading.gif';
import { useAppDispatch, useAppSelector } from '@hooks/redux.hook';
import toastFeature from '@features/toast';
import { ToastType } from '@constants/toast.constants';
import CreatableSelect from 'react-select/creatable';
import themeFeature from '@features/theme';

function AliasSection({ storyId }: AliasSectionProps) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const themeValue = useAppSelector(themeFeature.themeSelector.selectValue);
  const [isEditable, setEditable] = useState(false);
  const {
    data: aliasData,
    isLoading: isGettingAlias,
    setRefetch: setReGetAlias,
  } = useFetch(apis.aliasApi.getAliasByStoryId, {
    queries: {
      storyId,
    },
  });
  const [inputDataInit] = useState<InputData>({
    alias: [],
  });
  const [inputData, setInputData] = useState<InputData>(inputDataInit);
  const { values, handleChange, errors, validateAll } = useFormValidation<
    InputData,
    InputError
  >(inputData, generateValidateSchema());
  const [updateAliasReq, setUpdateAliasReq] = useState<RequestInit>({
    queries: {
      storyId,
    },
  });
  const {
    data: updateAliasResData,
    isLoading: isUpdatingAlias,
    error: updateAliasError,
    setRefetch: setReUpdateAlias,
  } = useFetch(apis.aliasApi.updateAlias, updateAliasReq, false);
  const [_alias, _setAlias] = useState([]);

  useEffect(() => {
    if (!isGettingAlias) {
      if (aliasData) {
        _setAlias(
          aliasData.map((alias: any) => ({
            label: alias.name,
            value: alias.name,
          }))
        );
        setInputData(aliasData.map((alias: any) => alias.name));
      }
    }
  }, [isGettingAlias]);

  useEffect(() => {
    setReGetAlias({
      value: true,
    });
  }, []);

  useEffect(() => {
    if (values) {
      setUpdateAliasReq({
        ...updateAliasReq,
        body: {
          ...values,
        },
      });
    }
  }, [values]);

  useEffect(() => {
    if (!isUpdatingAlias) {
      if (updateAliasResData) {
        setEditable(false);
        setReGetAlias({
          value: true,
        });
        dispatch(
          toastFeature.toastAction.add({
            type: ToastType.SUCCESS,
            title: t('notification.updateAliasSuccess'),
          })
        );
      } else {
        if (updateAliasError) {
          dispatch(
            toastFeature.toastAction.add({
              type: ToastType.ERROR,
              title: t('notification.updateAliasFailure'),
            })
          );
        }
      }
    }
  }, [isUpdatingAlias]);

  return (
    <div>
      <div className="grow space-y-1">
        <div>
          {t('author.storyManagementPage.uploadStoryPopup.form.alias.title')}
        </div>
        <div className="flex items-center justify-between">
          <div className="grow">
            <CreatableSelect
              isMulti
              isDisabled={!isEditable}
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
            {errors.alias && <ErrorMessage message={errors.alias} />}

            {isEditable && (
              <div className="flex justify-end mt-2 space-x-2">
                <Button
                  onClick={() => {
                    _setAlias(
                      aliasData
                        ? aliasData.map((alias: any) => ({
                            label: alias.name,
                            value: alias.name,
                          }))
                        : []
                    );
                    setInputData({
                      alias: aliasData
                        ? aliasData.map((alias: any) => alias.name)
                        : inputDataInit.alias,
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
                      setReUpdateAlias({
                        value: true,
                      });
                    }
                  }}
                >
                  {isUpdatingAlias ? (
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

export default memo(AliasSection);
