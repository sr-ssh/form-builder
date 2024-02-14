export const numberWithCommas = (x: number) =>
  x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

export const dateSplitter = (date: string) => {
  const year = date.substring(0, 4);
  const month = date.substring(4, 6);
  const day = date.substring(6, 8);
  return `${year}/${month}/${day}`;
};

let queryParams: any;

function getAllQueryParams() {
  const href = window.location.href;
  let index = href.indexOf("?");
  let params: string = "";
  if (index > 0) {
    params = href.substring(index + 1);
  }
  return params.split("&").reduce((result, item) => {
    const param = item.split("=");
    (result as any)[param[0]] = param[1];
    return result;
  }, {});
}

export function getQueryParam(key: string) {
  if (!queryParams) {
    queryParams = getAllQueryParams();
  }
  return queryParams[key];
}

export function getSerializedQueryParam(key: string) {
  try {
    const href = window.location.search;
    const searchParams = new URLSearchParams(href);
    return searchParams.get(key)?.toString();
  } catch (error) {
    console.log(error);
    return "";
  }
}
