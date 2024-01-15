export enum ConditionTypeEnum {
  Equal = "Equal",
  NotEqual = "NotEqual",
  MoreThan = "MoreThan",
  LessThan = "LessThan",
}

export enum ConditionCompositionEnum {
  And = "And",
  Or = "Or",
}

export type ConditionType = {
  control_id?: string;
  condition_type?: ConditionTypeEnum;
  composition_type?: ConditionCompositionEnum;
  condition_value?: string;
};
