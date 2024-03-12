import { getQueryParam } from "../core/utils/historyManager";

export const ApiURL = {
  BASE: "https://fronttest" + (getQueryParam("dc") || "2") + ".iranlms.ir",
};

export const defaultPayload = {
  api_version: 1,
  auth: getQueryParam("token"),
};
