import { ConditionType } from "../ConditionTypes";

export enum ControlConditionTypesEnum {
  ThenGo = "ThenGo",
  ThenShow = "ThenShow",
  ElseGo = "ElseGo",
}

export type ControlConditionType = {
  type?: ControlConditionTypesEnum;
  when_control_id?: string;
  then_control_id?: string;
  conditions?: ConditionType[];
};
