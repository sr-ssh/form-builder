import { ControlType } from "./ControlTypes";

export enum GroupTypesEnum {
  FieldSet = "FieldSet",
  FormSet = "FormSet",
}

export enum PageNoTypeEnum {
  None = "None",
  Number = "Number",
  PersianAlphabet = "PersianAlphabet",
  EnglishAlphabet = "EnglishAlphabet",
}

export type GroupType = {
  type?: GroupTypesEnum;
  title?: string;
  description?: string;
  controls?: ControlType[];
  page_no_type?: PageNoTypeEnum;
};
