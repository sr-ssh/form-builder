import { SendAnswerStatusEnum } from "../@types/AxiosApiTypes";
import { MessageType } from "../core/@types/commonView";
import { openToast } from "../core/utils/commonViews";
import { convertLocale } from "../hooks/useGlobalLocales";

export const handleSendAnswerErrors = (error: SendAnswerStatusEnum) => {
  switch (error) {
    case SendAnswerStatusEnum.InvalidInput:
      openToast({
        message: convertLocale("SEND_ANSWER_INVALID_INPUT_ERROR"),
        type: MessageType.Error,
      });
      break;
    case SendAnswerStatusEnum.NotAllowed:
      openToast({
        message: convertLocale("SEND_ANSWER_NOT_ALLOWED_ERROR"),
        type: MessageType.Error,
      });
      break;
    case SendAnswerStatusEnum.TimeOut:
      openToast({
        message: convertLocale("SEND_ANSWER_TIMEOUT_ERROR"),
        type: MessageType.Error,
      });
      break;

    default:
      openToast({
        message: "مشکلی پیش آمده است.",
        type: MessageType.Error,
      });
      break;
  }
};
