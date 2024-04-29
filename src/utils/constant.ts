import { getQueryParam } from "../core/utils/historyManager";
import { generateAndSaveToken } from "./tokenGenerator";

export const ApiURL = {
  BASE:
    "https://fronttest" +
    (getQueryParam("dc") || "2") +
    ".iranlms.ir/formclient",
};

export const defaultPayload = {
  api_version: 1,
  auth: getQueryParam("token") || generateAndSaveToken(),
};
