export enum TimeAgoType {
  SECOND = 'second',
  MINUTE = 'minute',
  HOUR = 'hour',
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
  YEAR = 'year',
}

export interface TimeAgo {
  type: TimeAgoType;
  value: number;
}

export function timeAgo(date: Date, currentTime: Date = new Date()): TimeAgo {
  let diffInSeconds = Math.floor(
    (currentTime.getTime() - date.getTime()) / 1000
  );
  diffInSeconds = diffInSeconds >= 0 ? diffInSeconds : 0;
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInWeeks = Math.floor(diffInDays / 7);
  const diffInMonths = Math.floor(diffInDays / 30);
  const diffInYears = Math.floor(diffInDays / 365);

  if (diffInSeconds < 60) {
    return {
      type: TimeAgoType.SECOND,
      value: diffInSeconds,
    };
  } else if (diffInMinutes < 60) {
    return {
      type: TimeAgoType.MINUTE,
      value: diffInMinutes,
    };
  } else if (diffInHours < 24) {
    return {
      type: TimeAgoType.HOUR,
      value: diffInHours,
    };
  } else if (diffInDays < 7) {
    return {
      type: TimeAgoType.DAY,
      value: diffInDays,
    };
  } else if (diffInWeeks < 4) {
    return {
      type: TimeAgoType.WEEK,
      value: diffInWeeks,
    };
  } else if (diffInMonths < 12) {
    return {
      type: TimeAgoType.MONTH,
      value: diffInMonths,
    };
  } else {
    return {
      type: TimeAgoType.YEAR,
      value: diffInYears,
    };
  }
}
