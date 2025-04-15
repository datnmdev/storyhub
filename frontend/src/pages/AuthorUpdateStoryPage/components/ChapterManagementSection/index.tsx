import { RequestInit } from '@apis/api.type';
import apis from '@apis/index';
import IconButton from '@components/IconButton';
import NoData from '@components/NoData';
import Pagination from '@components/Pagination';
import { ChapterStatus } from '@constants/chapter.constant';
import themeFeature from '@features/theme';
import useFetch from '@hooks/fetch.hook';
import { useAppSelector } from '@hooks/redux.hook';
import classNames from 'classnames';
import moment from 'moment';
import { memo, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Input, ConfigProvider, Tree } from 'antd';
import { ChapterManagementSectionProps } from './ChapterManagementSection.type';

function ChapterManagementSection({ storyId }: ChapterManagementSectionProps) {
  const { t } = useTranslation();
  const themeValue = useAppSelector(themeFeature.themeSelector.selectValue);
  const [getChaptersReq, setGetChaptersReq] = useState<RequestInit>({
    queries: {
      page: 1,
      limit: 24,
      status: JSON.stringify([
        ChapterStatus.UNRELEASED,
        ChapterStatus.PENDING_APPROVAL,
        ChapterStatus.RELEASING,
      ]),
      orderBy: JSON.stringify([
        ['createdAt', 'DESC'],
        ['updatedAt', 'DESC'],
        ['id', 'DESC'],
      ]),
      storyId,
    },
  });
  const {
    data: getChaptersResData,
    isLoading: isGettingChapters,
    setRefetch: setReGetChapters,
  } = useFetch(apis.chapterApi.getChapterForAuthorWithFilter, getChaptersReq);
  const [isOpenFilterBox, setOpenFilterBox] = useState(false);
  const filterBoxRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (e: MouseEvent) => {
    if (
      filterBoxRef.current &&
      !filterBoxRef.current.contains(e.target as Node)
    ) {
      setOpenFilterBox(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setReGetChapters({
      value: true,
    });
  }, [getChaptersReq]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <IconButton
          icon={<i className="fa-solid fa-plus"></i>}
          color="var(--white)"
          bgColor="var(--primary)"
          padding="8px 16px"
          borderRadius="4px"
          width={100}
        >
          {t('author.updateStoryPage.chapterManagementSection.btn.add')}
        </IconButton>

        <div className="space-x-2 flex items-center">
          <ConfigProvider
            theme={{
              components: {
                Button: {
                  colorPrimary: 'var(--primary)',
                  colorPrimaryHover: 'var(--primary)',
                  colorPrimaryActive: 'var(--primary)',
                },
                Input: {
                  colorPrimary: 'var(--primary)',
                  colorPrimaryHover: 'var(--primary)',
                  controlHeight: 38,
                  colorBgContainer: themeValue === 'light' ? 'white' : 'black',
                  colorText: themeValue === 'light' ? 'black' : 'white',
                  colorBorder: 'var(--primary)',
                  colorTextPlaceholder: 'var(--gray)',
                  borderRadius: 4,
                },
              },
            }}
          >
            <Input.Search
              style={{ width: 320 }}
              placeholder={t(
                'author.updateStoryPage.chapterManagementSection.search.placeholder'
              )}
              loading={isGettingChapters}
              enterButton
              height={36}
              onChange={(e) =>
                setGetChaptersReq({
                  queries: {
                    ...getChaptersReq.queries,
                    keyword: e.target.value,
                  },
                })
              }
            />
          </ConfigProvider>

          <div className="relative">
            <IconButton
              icon={<i className="fa-solid fa-filter text-white"></i>}
              bgColor="var(--primary)"
              height={38}
              width={38}
              borderRadius="4px"
              onClick={() => setOpenFilterBox(true)}
            />

            <div
              ref={filterBoxRef}
              className={classNames(
                'absolute top-[calc(100%+8px)] right-0 p-2 animate-fadeIn',
                themeValue === 'light'
                  ? 'light light__boxShadow'
                  : 'dark dark__boxShadow'
              )}
              style={{
                display: isOpenFilterBox ? 'block' : 'none',
              }}
            >
              <ConfigProvider
                theme={{
                  components: {
                    Tree: {
                      colorPrimary: 'var(--primary)',
                      colorPrimaryHover: 'var(--primary)',
                      colorBgContainer:
                        themeValue === 'light' ? 'white' : 'black',
                      colorText: themeValue === 'light' ? 'black' : 'white',
                      borderRadius: 4,
                    },
                  },
                }}
              >
                <Tree
                  checkable
                  selectable={false}
                  defaultExpandedKeys={['status']}
                  defaultCheckedKeys={['status']}
                  style={{
                    minWidth: 320,
                    maxHeight: 520,
                    overflowY: 'auto',
                  }}
                  onCheck={(selectedStatus: any) =>
                    setGetChaptersReq({
                      queries: {
                        ...getChaptersReq.queries,
                        status:
                          selectedStatus.filter(
                            (status: string) => status != 'status'
                          ).length > 0
                            ? JSON.stringify(
                                selectedStatus.filter(
                                  (status: string) => status != 'status'
                                )
                              )
                            : [],
                      },
                    })
                  }
                  treeData={[
                    {
                      title: t(
                        'author.updateStoryPage.chapterManagementSection.filter.status.title'
                      ),
                      key: 'status',
                      children: [
                        {
                          title: t(
                            'author.updateStoryPage.chapterManagementSection.filter.status.values.unreleased'
                          ),
                          key: ChapterStatus.UNRELEASED,
                        },
                        {
                          title: t(
                            'author.updateStoryPage.chapterManagementSection.filter.status.values.pendingApproval'
                          ),
                          key: ChapterStatus.PENDING_APPROVAL,
                        },
                        {
                          title: t(
                            'author.updateStoryPage.chapterManagementSection.filter.status.values.releasing'
                          ),
                          key: ChapterStatus.RELEASING,
                        },
                      ],
                    },
                  ]}
                />
              </ConfigProvider>
            </div>
          </div>
        </div>
      </div>

      {getChaptersResData && getChaptersResData?.[1] > 0 ? (
        <div>
          <div
            className={classNames(
              'h-full flex flex-col overflow-hidden',
              themeValue === 'light' ? 'bg-[var(--light-gray)]' : 'bg-[#242121]'
            )}
          >
            <div className="grow flex flex-col rounded-[4px] overflow-auto">
              <table className="w-full whitespace-nowrap">
                <thead className="bg-[var(--primary)] text-[var(--white)]">
                  <tr>
                    <th className="py-2 px-4">
                      {t(
                        'author.updateStoryPage.chapterManagementSection.table.thead.id'
                      )}
                    </th>
                    <th className="py-2 px-4">
                      {t(
                        'author.updateStoryPage.chapterManagementSection.table.thead.order'
                      )}
                    </th>
                    <th className="py-2 px-4">
                      {t(
                        'author.updateStoryPage.chapterManagementSection.table.thead.name'
                      )}
                    </th>
                    <th className="py-2 px-4">
                      {t(
                        'author.updateStoryPage.chapterManagementSection.table.thead.status'
                      )}
                    </th>
                    <th className="py-2 px-4">
                      {t(
                        'author.updateStoryPage.chapterManagementSection.table.thead.createdAt'
                      )}
                    </th>
                    <th className="py-2 px-4">
                      {t(
                        'author.updateStoryPage.chapterManagementSection.table.thead.action'
                      )}
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {getChaptersResData?.[0]?.map((row: any) => {
                    return (
                      <tr
                        key={row.id}
                        className="text-center border-b-[1px] border-solid border-[var(--gray)]"
                      >
                        <td className="py-4 align-middle">{row.id}</td>
                        <td className="py-4 align-middle">{row.order}</td>
                        <td className="py-4 align-middle">{row.name}</td>
                        <td className="py-4 align-middle">
                          {row.status === ChapterStatus.UNRELEASED && (
                            <span className="bg-gray-700 text-white px-4 py-2 rounded-[4px]">
                              {t(
                                'author.updateStoryPage.chapterManagementSection.table.tbody.status.unreleased'
                              )}
                            </span>
                          )}

                          {row.status === ChapterStatus.PENDING_APPROVAL && (
                            <span className="bg-sky-500 text-white px-4 py-2 rounded-[4px]">
                              {t(
                                'author.updateStoryPage.chapterManagementSection.table.tbody.status.pendingApproval'
                              )}
                            </span>
                          )}

                          {row.status === ChapterStatus.RELEASING && (
                            <span className="bg-green-500 text-white px-4 py-2 rounded-[4px]">
                              {t(
                                'author.updateStoryPage.chapterManagementSection.table.tbody.status.releasing'
                              )}
                            </span>
                          )}
                        </td>

                        <td className="py-4 align-middle">
                          {moment(row.createdAt).format('DD/MM/YYYY HH:mm:ss')}
                        </td>

                        <td className="py-4 align-middle">
                          <div className="flex justify-center items-center">
                            <IconButton
                              icon={
                                <i className="fa-solid fa-pen text-[1.2rem]"></i>
                              }
                              padding="8px"
                              color="blue"
                            />

                            <IconButton
                              icon={
                                <i className="fa-solid fa-trash-can text-[1.2rem]"></i>
                              }
                              padding="8px"
                              color="red"
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex justify-center items-center mt-6">
            <Pagination
              count={
                getChaptersResData?.[1]
                  ? Math.ceil(
                      getChaptersResData[1] / getChaptersReq.queries.limit
                    )
                  : 0
              }
              page={getChaptersReq.queries.page}
              onChange={(_e, page) =>
                setGetChaptersReq({
                  queries: {
                    ...getChaptersReq.queries,
                    page,
                  },
                })
              }
            />
          </div>
        </div>
      ) : (
        <div className="min-h-[320px] flex items-center justify-center">
          <NoData />
        </div>
      )}
    </div>
  );
}

export default memo(ChapterManagementSection);
