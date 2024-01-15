import { ControlConditionType } from "./ControlConditionTypes";
import { DatePickerType } from "./DatePickerTypes";
import { DropDownType } from "./DropDownTypes";
import { FileUploadType } from "./FileUploadTypes";
import { GroupType } from "./GroupTypes";
import { MultipleOptionType } from "../MultipleOptionTypes";
import { PlaceHolderType } from "./PlaceHolderTypes";
import { TextAreaType } from "./TextAreaTypes";
import { TextBoxType } from "./TextBoxTypes";
import { ValidationType } from "../ValidationTypes";

export enum ControlTypeEnum {
  TextBox = "TextBox",
  TextArea = "TextArea",
  FileUpload = "FileUpload",
  DatePicker = "DatePicker",
  MultipleOption = "MultipleOption",
  DropDown = "DropDown",
  PlaceHolder = "PlaceHolder",
  Group = "Group",
}

export type ControlType = {
  control_id: string;
  type: ControlTypeEnum;
  label_text: string;
  description?: string;
  textbox_info?: TextBoxType;
  textarea_info?: TextAreaType;
  file_upload_info?: FileUploadType;
  date_picker_info?: DatePickerType;
  multiple_option_info?: MultipleOptionType;
  dropdown_info?: DropDownType;
  placeholder_info?: PlaceHolderType;
  group_info?: GroupType;
  file_url?: string;
  validations?: ValidationType[];
  conditions?: ControlConditionType[];
  is_hidden?: boolean;
  event_id?: string;
};
