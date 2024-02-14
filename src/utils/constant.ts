import { getQueryParam } from "../core/utils/historyManager";

export const ApiURL = {
  BASE: "https://fronttest" + (getQueryParam("dc") || "2") + ".iranlms.ir",
};

export const defaultPayload = {
  api_version: 1,
  auth: "21RM3+c0uY7BpaQvgX+2mrHbdIq21BtBPrxCUgxfAnEWv4Ye2A6l2qWUdK3t2GQHLMWLEmA0qOgsPVHsV21h3JkZJ7EKMDpf+wqvPmTf8EEFNRC643x3r6m9xFQdds+xQyo6R+FVwsZ+W9/eDfZKt45Z04GSKwW6P1zJLdMYZoI=",
};
