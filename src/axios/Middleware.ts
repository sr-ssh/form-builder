import axios, { AxiosResponse } from "axios";
import {
  AxiosResponseType,
  HttpMiddlewareType,
  PureHttpMiddlewareType,
} from "../@types/AxiosTypes";
import { ApiURL } from "../utils/constant";
import { getUserToken } from "../utils/app";
import { getSerializedQueryParam } from "../utils/common";

const axiosInstance = axios.create();

const AxiosErrorHandler = async (type?: 0 | 1 | 2 | 3, message?: string) => {
  switch (type) {
    case 0:
      // eslint-disable-next-line no-throw-literal
      throw { type, message } as unknown as Error;
    case 2:
      // eslint-disable-next-line no-throw-literal
      throw { type, message } as unknown as Error;
    case 3:
      // eslint-disable-next-line no-throw-literal
      throw { type, message } as unknown as Error;

    default:
    // eslint-disable-next-line no-throw-literal
    // throw { type, message } as unknown as Error;
  }
};

const AxiosHandler = async <T extends AxiosResponseType>(
  axiosPromise: Promise<AxiosResponse<T, any>>,
) => {
  try {
    const res = (await axiosPromise) as AxiosResponse<T, any>;

    if (res?.data?.type && Number(res?.data?.type) === 1) {
      return res.data;
    } else {
      return await AxiosErrorHandler(res?.data?.type, res?.data?.message);
    }
  } catch (error) {
    throw error;
  }
};

export const PureHttpMiddleware = <T>(config: PureHttpMiddlewareType) =>
  axiosInstance.request<T>(config);

export const RawHttpMiddleware = <T extends AxiosResponseType>({
  payload,
  method = "post",
  headers = {},
  needAuth = false,
}: HttpMiddlewareType) => {
  const token = getUserToken() || getSerializedQueryParam("token");

  const { method: apiMethod, data } = payload;

  const url = ApiURL.BASE + apiMethod;

  return AxiosHandler<T>(
    axiosInstance.request({
      url,
      method,
      data,
      headers: {
        ...headers,
        ...(needAuth && token && { token }),
      },
    }),
  );
};

export const HttpMiddleware = async <T>(args: HttpMiddlewareType) =>
  (await RawHttpMiddleware<AxiosResponseType<T>>(args))?.data;
