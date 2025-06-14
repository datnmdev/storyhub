import { memo, useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact, {
  HighchartsReactProps,
} from 'highcharts-react-official';
import moment from 'moment';
import { RequestInit } from '@apis/api.type';
import useFetch from '@hooks/fetch.hook';
import apis from '@apis/index';
import TimeUtils from '@utilities/time.util';
import UrlUtils from '@utilities/url.util';
import { StoryStatus } from '@constants/story.constants';
import i18n from '@i18n/index';

const _options: any = {
  chart: {
    type: 'line',
    backgroundColor: 'transparent',
    animation: true,
  },
  title: {
    text: null,
  },
  subtitle: {
    text: null,
  },
  xAxis: {
    type: 'datetime',
    title: {
      text: null,
    },
    labels: {
      format: '{value:HH:mm}',
      style: {
        color: '#888',
      },
    },
    categories: [
      '14:00',
      '',
      '16:00',
      '',
      '18:00',
      '',
      '20:00',
      '',
      '22:00',
      '',
      '00:00',
      '',
      '02:00',
      '',
      '04:00',
      '',
      '06:00',
      '',
      '08:00',
      '',
      '10:00',
      '',
      '12:00',
      '',
    ],
    tickPosition: 'outside',
    crosshair: {
      width: 1,
    },
  },
  yAxis: {
    visible: true,
    title: {
      text: null,
    },
    labels: {
      enabled: false,
    },
    gridLineColor: '#463F4F',
    gridLineWidth: 0.4,
    gridLineDashStyle: 'longdash',
  },
  plotOptions: {
    series: {
      marker: {
        enabled: true,
        states: {
          hover: {
            enabled: true,
          },
        },
        symbol: 'circle',
      },
      cursor: 'pointer',
      point: {
        events: {
          mouseOver: function () {
            this.series.chart.xAxis[0].update({
              crosshair: {
                color: this.color,
              },
            });
          },
        } as any,
      },
    },
  },
  legend: {
    enabled: false,
  },
  series: [
    {
      type: 'spline',
      color: '#4A90E2',
      data: [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ],
      animation: {
        duration: 2000,
      },
    },
    {
      type: 'spline',
      color: '#FF0000',
      data: [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ],
    },
    {
      type: 'spline',
      color: '#25BE9C',
      data: [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ],
    },
  ],
  tooltip: {
    useHTML: true,
    formatter: function () {
      return []
        .concat(
          this.points
            ? this.points.map(function (point: any) {
                return `
                             <div style="display:flex;justify-content:space-between;width:280px;align-items:center;font-size:1rem">
                                 <div style="display:flex;justify-content:space-between;">
                                     <img
                                         style="width:48px;height:48px;flex-shrink:0;object-fit:cover;object-position:center;"
                                         src=${point.series.userOptions.story.coverImage}
                                         alt="Image" 
                                     />
                                     <div style="flex-grow:1;margin-left:8px;">
                                         <div class="line-clamp-1 max-w-[232px]" style="font-weight:700;">${point.series.userOptions.story.title}</div>
                                         <div style="font-size:0.7rem;margin-top:4px;"><span style="background-color:${point.series.userOptions.story.status === StoryStatus.RELEASING ? '#008001' : '#0BA5E9'};color:white;padding:4px;border-radius:2px;">${point.series.userOptions.story.status === StoryStatus.RELEASING ? i18n.t('reader.rankPage.topViewSection.chart.story.status.publishing') : i18n.t('reader.rankPage.topViewSection.chart.story.status.finished')}</span></div>
                                     </div>
                                 </div>
                                 
                                 <div style="font-weight:700;font-size:1.05rem;color:${point.series.color};">${Math.round(point.y * 100)}%</div>
                             </div>
                         `;
              })
            : []
        )
        .join('<br/>');
    },
    split: false,
    shared: true,
    outside: true,
  } as any,
};

function Chart() {
  const [options, setOptions] = useState(_options);
  const [getTopViewChartDataRequest, setGetTopViewChartDataRequest] =
    useState<RequestInit>();
  const { data, isLoading, setRefetch } = useFetch(
    apis.viewApi.getTopViewChartData,
    getTopViewChartDataRequest,
    false
  );

  function categoriesGenerator(endTime: number) {
    endTime -= 3600000;
    const result: HighchartsReactProps = [''];

    for (let i = 0; i < 12; ++i) {
      result.unshift('');
      result.unshift(moment(endTime).format('HH:mm'));
      endTime -= 3600000 * 2;
    }
    return result;
  }

  useEffect(() => {
    if (!getTopViewChartDataRequest) {
      const now = TimeUtils.getMillisecondsToRoundedTime();
      setGetTopViewChartDataRequest({
        queries: {
          atTime: now,
        },
      });
    } else {
      const intervalId = setInterval(() => {
        const now = TimeUtils.getMillisecondsToRoundedTime();
        setGetTopViewChartDataRequest({
          queries: {
            atTime: now,
          },
        });
      }, 3600000);

      return () => {
        clearInterval(intervalId);
      };
    }
  }, []);

  useEffect(() => {
    if (getTopViewChartDataRequest) {
      setRefetch({
        value: true,
      });
    }
  }, [getTopViewChartDataRequest]);

  useEffect(() => {
    if (!isLoading) {
      if (data) {
        setOptions({
          ...Object.assign({}, options),
          series: [
            {
              type: 'spline',
              color: '#4A90E2',
              story: {
                ...data[0],
                coverImage: UrlUtils.generateUrl(data[0].coverImage),
              },
              data: data[0].chartData,
            },
            {
              type: 'spline',
              color: '#25BE9C',
              story: {
                ...data[1],
                coverImage: UrlUtils.generateUrl(data[1].coverImage),
              },
              data: data[1].chartData,
            },
            {
              type: 'spline',
              color: '#FF0000',
              story: {
                ...data[2],
                coverImage: UrlUtils.generateUrl(data[2].coverImage),
              },
              data: data[2].chartData,
            },
          ],
          xAxis: {
            ...Object.assign({}, options.xAxis),
            categories: categoriesGenerator(
              getTopViewChartDataRequest?.queries.atTime
            ),
          },
        });
      }
    }
  }, [isLoading]);

  return (
    <HighchartsReact
      highcharts={Highcharts}
      constructorType={'chart'}
      options={options}
    />
  );
}

export default memo(Chart);
