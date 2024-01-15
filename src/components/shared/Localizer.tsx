import { LocalizerPropsType } from "../../@types/LocalizerTypes";
import { useGlobalLocales } from "../../hooks/useGlobalLocales";

export const Localizer = ({ localeKey, params }: LocalizerPropsType) => {
  const { langEl } = useGlobalLocales();

  return langEl(localeKey, params);
};
