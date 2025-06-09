import { RequestInit } from '@apis/api.type';
import apis from '@apis/index';
import IconButton from '@components/IconButton';
import NoData from '@components/NoData';
import Pagination from '@components/Pagination';
import themeFeature from '@features/theme';
import useFetch from '@hooks/fetch.hook';
import { useAppSelector } from '@hooks/redux.hook';
import classNames from 'classnames';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Input, ConfigProvider, Tree } from 'antd';
import { ModerationRequestStatus } from '@constants/moderationRequest.constants';
import ModerationPopup from './components/ModerationPopup';
import ModerationRequestRow from './components/ModerationRequestRow';
import Loading from '@components/Loading';

function ModerationRequestManagementSection() {
  const { t } = useTranslation();
  const themeValue = useAppSelector(themeFeature.themeSelector.selectValue);
  const [isOpenModerationPopup, setOpenModerationPopup] = useState(false);
  const [getModerationRequestReq, setGetModerationRequestReq] =
    useState<RequestInit>({
      queries: {
        page: 1,
        limit: 24,
        status: JSON.stringify([
          ModerationRequestStatus.PENDING,
          ModerationRequestStatus.APPROVED,
          ModerationRequestStatus.REJECTED,
        ]),
        orderBy: JSON.stringify([
          ['createdAt', 'DESC'],
          ['id', 'DESC'],
        ]),
      },
    });
  const {
    data: getModerationRequestsResData,
    isLoading: isGettingModerationRequests,
    setRefetch: setReGetModerationRequests,
  } = useFetch(
    apis.moderationRequestApi.getModerationRequests,
    getModerationRequestReq
  );
  const [isOpenFilterBox, setOpenFilterBox] = useState(false);
  const filterBoxRef = useRef<HTMLDivElement>(null);
  const [selectedModerationRequest, setSelectedModerationRequest] =
    useState<any>(null);

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
    setReGetModerationRequests({
      value: true,
    });
  }, [getModerationRequestReq]);

  useEffect(() => {
    if (selectedModerationRequest) {
      setOpenModerationPopup(true);
    }
  }, [selectedModerationRequest]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-[1.6rem] font-[450]">
          {t('moderator.moderationRequestManagementPage.title')}
        </h3>

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
              placeholder={t('author.storyManagementPage.search.placeholder')}
              enterButton
              height={36}
              onChange={(e) =>
                setGetModerationRequestReq({
                  queries: {
                    ...getModerationRequestReq.queries,
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
                    setGetModerationRequestReq({
                      queries: {
                        ...getModerationRequestReq.queries,
                        status:
                          selectedStatus.filter(
                            (status: string) => status != 'status'
                          ).length > 0
                            ? JSON.stringify(
                                selectedStatus.filter(
                                  (status: string) => status != 'status'
                                )
                              )
                            : JSON.stringify([]),
                      },
                    })
                  }
                  treeData={[
                    {
                      title: t(
                        'moderator.moderationRequestManagementPage.filter.status.title'
                      ),
                      key: 'status',
                      children: [
                        {
                          title: t(
                            'moderator.moderationRequestManagementPage.filter.status.values.pending'
                          ),
                          key: ModerationRequestStatus.PENDING,
                        },
                        {
                          title: t(
                            'moderator.moderationRequestManagementPage.filter.status.values.approved'
                          ),
                          key: ModerationRequestStatus.APPROVED,
                        },
                        {
                          title: t(
                            'moderator.moderationRequestManagementPage.filter.status.values.rejected'
                          ),
                          key: ModerationRequestStatus.REJECTED,
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

      {!isGettingModerationRequests ? (
        getModerationRequestsResData?.[0]?.length > 0 ? (
          <div>
            <div
              className={classNames(
                'h-full flex flex-col overflow-hidden',
                themeValue === 'light'
                  ? 'bg-[var(--light-gray)]'
                  : 'bg-[#242121]'
              )}
            >
              <div className="grow flex flex-col rounded-[4px] overflow-auto">
                <table className="w-full whitespace-nowrap">
                  <thead className="bg-[var(--primary)] text-[var(--white)]">
                    <tr>
                      <th className="py-2 px-4">
                        {t(
                          'moderator.moderationRequestManagementPage.table.thead.id'
                        )}
                      </th>
                      <th className="py-2 px-4">
                        {t(
                          'moderator.moderationRequestManagementPage.table.thead.status'
                        )}
                      </th>
                      <th className="py-2 px-4">
                        {t(
                          'moderator.moderationRequestManagementPage.table.thead.chapterId'
                        )}
                      </th>
                      <th className="py-2 px-4">
                        {t(
                          'moderator.moderationRequestManagementPage.table.thead.authorId'
                        )}
                      </th>
                      <th className="py-2 px-4">
                        {t(
                          'moderator.moderationRequestManagementPage.table.thead.createdAt'
                        )}
                      </th>
                      <th className="py-2 px-4">
                        {t(
                          'moderator.moderationRequestManagementPage.table.thead.action'
                        )}
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {getModerationRequestsResData[0].map((row: any) => {
                      return (
                        <ModerationRequestRow
                          key={row.id}
                          data={row}
                          setSelectedModerationRequest={
                            setSelectedModerationRequest
                          }
                        />
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-center items-center mt-6">
              <Pagination
                count={
                  getModerationRequestsResData?.[1]
                    ? Math.ceil(
                        getModerationRequestsResData[1] /
                          getModerationRequestReq.queries.limit
                      )
                    : 0
                }
                page={getModerationRequestReq.queries.page}
                onChange={(_e, page) =>
                  setGetModerationRequestReq({
                    queries: {
                      ...getModerationRequestReq.queries,
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
        )
      ) : (
        <Loading level="component" />
      )}

      <div className={classNames(isOpenModerationPopup ? 'block' : 'hidden')}>
        <ModerationPopup
          data={selectedModerationRequest}
          setRefetchModerationRequestList={setReGetModerationRequests}
          setOpenModerationPopup={setOpenModerationPopup}
          onClose={() => setOpenModerationPopup(false)}
        />
      </div>
    </div>
  );
}

export default ModerationRequestManagementSection;
