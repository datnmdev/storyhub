import IconButton from '@components/IconButton';
import { ModerationRequestStatus } from '@constants/moderationRequest.constants';
import classNames from 'classnames';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import lodash from 'lodash';
import { Dispatch, memo, SetStateAction } from 'react';

interface ModerationRequestRowProps {
  data: any;
  setSelectedModerationRequest: Dispatch<SetStateAction<any>>;
}

function ModerationRequestRow({
  data,
  setSelectedModerationRequest,
}: ModerationRequestRowProps) {
  const { t } = useTranslation();

  return (
    <tr
      key={data.id}
      className="text-center border-b-[1px] border-solid border-[var(--gray)]"
    >
      <td className="py-4 align-middle">{data.id}</td>
      <td className="py-4 align-middle">
        {data.status === ModerationRequestStatus.PENDING && (
          <span className="bg-blue-500 text-white px-4 py-2 rounded-[4px]">
            {t(
              'moderator.moderationRequestManagementPage.table.tbody.status.pending'
            )}
          </span>
        )}

        {data.status === ModerationRequestStatus.APPROVED && (
          <span className="bg-green-500 text-white px-4 py-2 rounded-[4px]">
            {t(
              'moderator.moderationRequestManagementPage.table.tbody.status.approved'
            )}
          </span>
        )}

        {data.status === ModerationRequestStatus.REJECTED && (
          <span className="bg-red-500 text-white px-4 py-2 rounded-[4px]">
            {t(
              'moderator.moderationRequestManagementPage.table.tbody.status.rejected'
            )}
          </span>
        )}
      </td>

      <td className="py-4 align-middle text-nowrap text-ellipsis overflow-hidden max-w-[320px]">
        {data.chapterId}
      </td>

      <td className="py-4 align-middle text-nowrap text-ellipsis overflow-hidden max-w-[320px]">
        {data.authorId}
      </td>

      <td className="py-4 align-middle">
        {moment(data.createdAt).format('DD/MM/YYYY HH:mm:ss')}
      </td>

      <td className="py-4 align-middle">
        <div
          className={classNames(
            'flex justify-center items-center',
            data.status === ModerationRequestStatus.PENDING ? 'block' : 'hidden'
          )}
        >
          <IconButton
            icon={<i className="fa-solid fa-eye text-green-500"></i>}
            padding="8px"
            color="blue"
            onClick={() => setSelectedModerationRequest(lodash.cloneDeep(data))}
          />
        </div>
      </td>
    </tr>
  );
}

export default memo(ModerationRequestRow);
