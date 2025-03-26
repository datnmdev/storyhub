import Chart from '@pages/ReaderRankPage/components/TopViewSection/components/Chart';
import TopStoryList from '@pages/ReaderRankPage/components/TopViewSection/components/TopStoryList';
import { memo } from 'react';

function StoryhubChart() {
  return (
    <div>
      <h3 className="text-[1.4rem] font-[700] font-sans text-transparent [background-image:linear-gradient(90deg,#977EF5_0%,#D33567_32%,#FF0000_100%)] bg-clip-text">
        #StoryhubChart
      </h3>

      <div>
        <Chart />
      </div>

      <div className="mt-6">
        <TopStoryList />
      </div>
    </div>
  );
}

export default memo(StoryhubChart);
