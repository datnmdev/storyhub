import moment from 'moment';

const TimeUtils = {
  getMillisecondsToRoundedTime() {
    const now = moment.utc();
    const roundedTime = now.clone().startOf('day').add(now.hour(), 'hours');
    return roundedTime.valueOf();
  },
};

export default TimeUtils;
