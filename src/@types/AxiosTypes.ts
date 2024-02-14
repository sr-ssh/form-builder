import { AxiosRequestConfig } from "axios";
import { ApiMethodEnum } from "./AxiosApiTypes";

export type AxiosResponseType<T = any> = {
  type: 0 | 1 | 2 | 3;
  message?: string;
  data?: T;
};

export type HttpMiddlewarePayloadType = {
  method: ApiMethodEnum;
  data?: any;
};

export type HttpMiddlewareType = {
  payload: HttpMiddlewarePayloadType;
  method?: "post" | "get" | "patch" | "put";
  headers?: Record<string, string>;
  needAuth?: boolean;
};

export type PureHttpMiddlewareType = AxiosRequestConfig;
