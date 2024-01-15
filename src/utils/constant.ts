import { getQueryParam } from "../core/utils/historyManager";

export const ApiURL = {
  BASE: "https://arzarbaeen" + (getQueryParam("dc") || "0") + ".iranlms.ir",
};

export const defaultPayload = {
  api_version: 1,
};
