import { AxiosResponse } from 'axios';

export interface RequestInit<
  BodyType = any,
  ParamsType = any,
  QueriesType = any,
> {
  body?: BodyType | any;
  params?: ParamsType | any;
  queries?: QueriesType | any;
  uri?: string;
  headers?: Record<string, string>;
}

export type CallApiFunction = (
  options: RequestInit
) => Promise<AxiosResponse<any, any>>;
