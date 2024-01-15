import { AxiosRequestConfig } from "axios";
import { ApiMethodEnum } from "./AxiosApiTypes";

export enum ApiErrorStatusEnum {
  SERVER_ERROR = "SERVER_ERROR",
}

export type AxiosResponseType<T = any> = {
  status: string;
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
};

export type PureHttpMiddlewareType = AxiosRequestConfig;
