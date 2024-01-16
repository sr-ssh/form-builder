import {
  ApiMethodEnum,
  DoneFormRequestDateType,
  DoneFormResponseDateType,
  GetEventControlsRequestDateType,
  GetEventControlsResponseDateType,
  GetFormRequestDataType,
  GetFormResponseDataType,
  RequestSendFileRequestDateType,
  RequestSendFileResponseDateType,
  SendAnswerRequestDateType,
  SendAnswerResponseDateType,
  SendFileHeaderDateType,
  SendFileRequestDateType,
  SendFileResponseDateType,
} from "../@types/AxiosApiTypes";
import { ControlType } from "../@types/controls/ControlTypes";
import { HttpMiddleware, PureHttpMiddleware } from "./Middleware";

import tehranCities from "../getEventControls1.json";
import khorasanCities from "../getEventControls2.json";
import boushehrCities from "../getEventControls0.json";

export const AxiosApi = {
  GetForm: (data: GetFormRequestDataType) =>
    HttpMiddleware<GetFormResponseDataType>({
      payload: {
        data,
        method: ApiMethodEnum.GET_FORM,
      },
    }),
  SendAnswer: (data: SendAnswerRequestDateType) =>
    HttpMiddleware<SendAnswerResponseDateType>({
      payload: {
        data,
        method: ApiMethodEnum.SEND_ANSWER,
      },
    }),
  DoneForm: (data: DoneFormRequestDateType) =>
    HttpMiddleware<DoneFormResponseDateType>({
      payload: {
        data,
        method: ApiMethodEnum.DONE_FORM,
      },
    }),
  GetEventControls: (data: GetEventControlsRequestDateType) =>
    HttpMiddleware<GetEventControlsResponseDateType>({
      payload: {
        data,
        method: ApiMethodEnum.GET_EVENT_CONTROLS,
      },
    }),
  FakeGetEventControls: (value: string | number) => {
    switch (value) {
      case 0:
        return boushehrCities.controls as unknown as ControlType[];
      case 1:
        return tehranCities.controls as unknown as ControlType[];
      case 2:
        return khorasanCities.controls as unknown as ControlType[];
    }
  },
  RequestSendFile: (data: RequestSendFileRequestDateType) =>
    HttpMiddleware<RequestSendFileResponseDateType>({
      payload: {
        data,
        method: ApiMethodEnum.REQUEST_SEND_FILE,
      },
    }),
  SendFile: ({
    data,
    headers,
  }: {
    data: SendFileRequestDateType;
    headers: SendFileHeaderDateType;
  }) =>
    PureHttpMiddleware<SendFileResponseDateType>({
      data,
      headers,
      method: ApiMethodEnum.SEND_FILE,
    }),
};
