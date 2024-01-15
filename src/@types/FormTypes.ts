import { ControlType } from "./controls/ControlTypes";
import { LayoutType } from "./LayoutTypes";
import { ThemeType } from "./ThemeTypes";

export enum ProgressDisplayModeEnum {
  None = "None",
  PageNumber = "PageNumber",
  Percent = "Percent",
}

export enum FormStatusEnum {
  New = "New",
  Registration = "Registration",
  Done = "Done",
}

export enum LocaleEnum {
  Persian = "Persian",
  English = "English",
}
export type FormValuesType = { [controlId: string]: string | number };

export type FormType = {
  form_id: string;
  title?: string;
  controls: ControlType[];
  layout?: LayoutType;
  theme: ThemeType;
  hide_question_number?: boolean;
  values: FormValuesType;
  has_next?: boolean;
  has_prev?: boolean;
  progress_display_mode?: ProgressDisplayModeEnum;
  start_time?: number;
  end_time?: number;
  max_duration?: number;
  user_start_time?: number;
  disabled_edit_answer?: boolean;
  enable_edit_form?: boolean;
  form_status?: FormStatusEnum;
  locale?: LocaleEnum;
  required_answer?: boolean;
};
