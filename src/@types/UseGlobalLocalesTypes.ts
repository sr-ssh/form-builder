import { ReactNode } from "react";

export type ConvertLocaleType = {
  key: string;
  params?: {
    [key: string]: ReactNode;
  };
};
