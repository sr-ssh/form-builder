import { ReactNode, createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { globalLocales as faLocale } from "../locale/fa";
import { globalLocales as enLocale } from "../locale/en";

export const convertLocale = (
  key: string,
  params?: { [key: string]: ReactNode },
) => {
  let locale =
    ((window as any).lang === "en" ? enLocale[key] : faLocale[key]) || key;
  params &&
    Object.entries(params).forEach(([paramKey, paramValue]) => {
      const shapedKey = `{{${paramKey}}}`;
      const stringParamValue = renderToStaticMarkup(<>{paramValue}</>);
      locale = locale.replace(shapedKey, `${stringParamValue}` || "");
    });
  return locale;
};

export const useGlobalLocales = () => {
  const langEl = (key: string, params?: { [key: string]: ReactNode }) => {
    const locale = convertLocale(key, params);
    return createElement("span", {
      dangerouslySetInnerHTML: {
        __html: locale,
      },
      style: {
        display: "inline-block",
      },
    });
  };

  return { lang: convertLocale, langEl };
};
