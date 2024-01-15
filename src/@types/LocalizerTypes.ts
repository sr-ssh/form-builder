import { ReactNode } from "react";

export type LocalizerPropsType = {
  localeKey: string;
  params?: {
    [key: string]: ReactNode;
  };
};
