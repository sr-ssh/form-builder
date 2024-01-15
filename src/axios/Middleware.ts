import axios, { AxiosResponse } from "axios";
import {
  ApiErrorStatusEnum,
  AxiosResponseType,
  HttpMiddlewareType,
  PureHttpMiddlewareType,
} from "../@types/AxiosTypes";
import { ApiURL, defaultPayload } from "../utils/constant";
import { getQueryParam } from "../core/utils/historyManager";

const axiosInstance = axios.create({
  baseURL: ApiURL.BASE,
});

const AxiosErrorHandler = async (status?: string, message?: string) => {
  switch (status) {
    case ApiErrorStatusEnum.SERVER_ERROR:
      // eslint-disable-next-line no-throw-literal
      throw { status, message } as unknown as Error;

    default:
      // eslint-disable-next-line no-throw-literal
      throw { status, message } as unknown as Error;
  }
};

const AxiosHandler = async <T extends AxiosResponseType>(
  axiosPromise: Promise<AxiosResponse<T, any>>,
) => {
  try {
    const res = (await axiosPromise) as AxiosResponse<T, any>;

    if (res?.data?.status && res?.data?.status?.toLowerCase() === "ok") {
      return res.data;
    } else {
      return await AxiosErrorHandler(res?.data?.status, res?.data?.message);
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
  headers,
}: HttpMiddlewareType) => {
  const token = getQueryParam("token");

  const data = {
    ...defaultPayload,
    ...payload,
    token,
  };

  return AxiosHandler<T>(
    axiosInstance.request({
      method,
      data,
      headers,
    }),
  );
};

export const HttpMiddleware = async <T>(args: HttpMiddlewareType) =>
  (await RawHttpMiddleware<AxiosResponseType<T>>(args)).data;
