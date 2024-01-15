import { FieldValues } from "react-hook-form";
import {
  ConditionCompositionEnum,
  ConditionTypeEnum,
} from "../@types/ConditionTypes";
import {
  ControlConditionType,
  ControlConditionTypesEnum,
} from "../@types/controls/ControlConditionTypes";
import { ControlType, ControlTypeEnum } from "../@types/controls/ControlTypes";
import { FormType, FormValuesType } from "../@types/FormTypes";
import { GroupTypesEnum } from "../@types/controls/GroupTypes";
import { PageIndexesType } from "../@types/FormPageTypes";

export const getControl = (
  controls: ControlType[],
  index: number[],
): ControlType | null => {
  if (!index.length) {
    return null;
  }
  if (index.length === 1) {
    return controls?.[index[0]];
  }
  return getControl(
    controls?.[index[0]].group_info?.controls || [],
    index.slice(1),
  );
};

export const getControlById = (
  controls: ControlType[],
  id: string,
): ControlType | null => {
  for (let i = 0; i < controls.length; i++) {
    const control = controls[i];
    if (control.control_id === id) {
      return control;
    } else if (control.group_info?.controls) {
      const foundControl = getControlById(control.group_info?.controls, id);
      if (foundControl) {
        return foundControl;
      }
    }
  }
  return null;
};

export const passCondition = (
  conditions: ControlConditionType[],
  values: FieldValues,
  controlConditionType: ControlConditionTypesEnum = ControlConditionTypesEnum.ThenShow,
) => {
  for (let j = 0; j < conditions.length; j++) {
    const condition = conditions[j];
    if (condition.type !== controlConditionType) {
      continue;
    }
    let overallValue: boolean | undefined = undefined;
    if (!condition.conditions) return null;
    for (let i = 0; i < condition.conditions.length || 0; i++) {
      const cond = condition.conditions[i];
      if (!cond.control_id) {
        continue;
      }
      const value = values[cond.control_id];
      const prevCond = i === 0 ? null : condition.conditions[i - 1];
      let currValue;
      if (cond.condition_value === undefined) {
        return null;
      }
      let conditionValue: string | number = parseInt(cond.condition_value);
      conditionValue = isNaN(conditionValue)
        ? cond.condition_value
        : conditionValue;
      let numberValue: string | number = parseInt(value);
      numberValue = isNaN(numberValue) ? value : numberValue;

      switch (cond.condition_type) {
        case ConditionTypeEnum.Equal:
          currValue = conditionValue === numberValue;
          break;
        case ConditionTypeEnum.MoreThan:
          currValue = conditionValue < numberValue;
          break;
        case ConditionTypeEnum.LessThan:
          currValue = conditionValue > numberValue;
          break;
        case ConditionTypeEnum.NotEqual:
          currValue = conditionValue !== numberValue;
          break;
        default:
          break;
      }

      if (
        !currValue &&
        cond.composition_type === ConditionCompositionEnum.And
      ) {
        overallValue = false;
        break;
      }
      overallValue =
        overallValue === undefined
          ? currValue
          : prevCond?.composition_type === ConditionCompositionEnum.And
          ? overallValue && currValue
          : overallValue || currValue;
    }

    if (
      overallValue ||
      (!overallValue &&
        controlConditionType === ControlConditionTypesEnum.ElseGo)
    ) {
      return condition.then_control_id;
    }
  }
  return null;
};

const findThenId = (form: FormType, indexes: number[], values: FieldValues) => {
  let thenId: string | null | undefined;

  const currentControl = getControl(form.controls, indexes);
  if (currentControl?.conditions) {
    thenId = passCondition(
      currentControl?.conditions,
      values,
      ControlConditionTypesEnum.ThenGo,
    );
    if (!thenId) {
      thenId = passCondition(
        currentControl?.conditions,
        values,
        ControlConditionTypesEnum.ElseGo,
      );
    }
  }
  return thenId;
};

const getNextIndexFromConditions = (
  form: FormType,
  indexes: number[],
  values: FieldValues,
) => {
  let thenIndex: number | undefined;
  let thenId = findThenId(form, indexes, values);
  if (!thenId) {
    return null;
  }
  // find index
  if (indexes.length === 1) {
    thenIndex = form.controls.findIndex((item) => item.control_id === thenId);
  } else {
    const group = getControl(form.controls, indexes.slice(0, -1));
    thenIndex = group?.group_info?.controls?.findIndex(
      (item) => item.control_id === thenId,
    );
  }
  return thenIndex !== undefined && thenIndex !== -1
    ? indexes.slice(0, -1).concat(thenIndex)
    : null;
};

export const getNextIndex = (
  form: FormType,
  index: number[],
  values?: FieldValues,
): number[] | null => {
  if (!form.controls?.length) {
    return null;
  }
  if (values) {
    const nextIndexBaseOnCondition = getNextIndexFromConditions(
      form,
      index,
      values,
    );
    if (nextIndexBaseOnCondition) {
      return nextIndexBaseOnCondition;
    }
  }
  const filteredControls = hideControlsWithConditionOn(form.controls);
  let nextControl;
  let nextIndex: PageIndexesType | null = [];
  let isHidden: boolean | undefined = true;
  while (isHidden) {
    nextIndex = getParentWithLeftChildren(
      filteredControls,
      [...(nextIndex?.length ? nextIndex : index)],
      0,
    );
    if (!nextIndex) {
      return null;
    }
    nextControl = getControl(filteredControls, nextIndex);
    isHidden = nextControl?.is_hidden;
  }
  if (!nextControl) {
    return null;
  }
  if (
    nextControl.type === ControlTypeEnum.Group &&
    nextControl.group_info?.type === GroupTypesEnum.FieldSet &&
    nextControl.group_info.controls?.length
  ) {
    return nextIndex?.concat(0) || null;
  }
  return nextIndex || null;
};

const getParentWithLeftChildren = (
  controls: ControlType[],
  index: number[],
  i: number,
): number[] | null => {
  const parentControl = getControl(controls, index.slice(0, -1 - i));
  if (
    parentControl?.group_info?.controls &&
    parentControl?.group_info?.controls?.length >
      index[index.length - 1 - i] + 1
  ) {
    index[index.length - 1 - i] = index[index.length - 1 - i] + 1;
    return i === 0 ? index.slice(0) : index.slice(0, -i);
  } else if (
    parentControl?.group_info?.controls &&
    parentControl?.group_info?.controls?.length <=
      index[index.length - 1 - i] + 1
  ) {
    return getParentWithLeftChildren(controls, index, i + 1);
  } else if (
    !parentControl &&
    controls?.length > index[index.length - 1 - i] + 1
  ) {
    index[index.length - 1 - i] = index[index.length - 1 - i] + 1;
    return i === 0 ? index.slice(0) : index.slice(0, -i);
  } else {
    return null;
  }
};

export const hideControlsWithConditionOn = (controls: ControlType[]) => {
  let filteredControls = [...controls];
  for (let i = 0; i < controls.length; i++) {
    const control = controls[i];
    if (control.conditions?.length) {
      for (let j = 0; j < control.conditions.length; j++) {
        const condition = control.conditions[j];
        filteredControls.map((item) => {
          if (item.control_id === condition.then_control_id) {
            item.is_hidden = true;
          }
          return item;
        });
      }
    }
  }
  return filteredControls;
};

export const getControlParentById = (
  parent: ControlType,
  controls: ControlType[],
  id: string,
): ControlType | null => {
  for (let i = 0; i < controls.length; i++) {
    const control = controls[i];
    if (control.control_id === id) {
      return parent;
    } else if (control.group_info?.controls) {
      const parentControl = getControlParentById(
        control,
        control.group_info?.controls,
        id,
      );
      if (parentControl) {
        return parentControl;
      }
    }
  }
  return null;
};

export const getDefaultValues = (
  control: ControlType,
  defaultValues: FormValuesType,
) => {
  let defaults: FormValuesType = {};
  if (defaultValues[control.control_id]) {
    defaults[control.control_id] = defaultValues[control.control_id];
  }
  if (
    control.type === ControlTypeEnum.MultipleOption &&
    control.multiple_option_info?.default_selected_index
  ) {
    defaults[control.control_id] =
      control.multiple_option_info?.default_selected_index;
  }
  if (control.type === ControlTypeEnum.Group) {
    control.group_info?.controls?.forEach(
      (item) =>
        (defaults = { ...defaults, ...getDefaultValues(item, defaultValues) }),
    );
  }
  return defaults;
};

export const updateArrayWithControlId = (
  arr1: ControlType[],
  arr2: ControlType[],
) => {
  // Create a map from the second array using control_id as the key for easy lookup
  const controlMap = new Map(arr2.map((item) => [item.control_id, item]));

  // Iterate over the first array and update its items with the corresponding ones from the second array
  const updatedArray = arr1.map((item) => {
    if (controlMap.has(item.control_id)) {
      // If a matching control_id is found, merge the objects, with values from the second array taking precedence
      return { ...item, ...controlMap.get(item.control_id) };
    }
    // If no match is found, return the item from the first array as is
    return item;
  });

  return updatedArray;
};

export const persianAlphabet = [
  "آ",
  "ب",
  "پ",
  "ت",
  "ث",
  "ج",
  "چ",
  "ح",
  "خ",
  "د",
  "ذ",
  "ر",
  "ز",
  "ژ",
  "س",
  "ش",
  "ص",
  "ض",
  "ط",
  "ظ",
  "ع",
  "غ",
  "ف",
  "ق",
  "ک",
  "گ",
  "ل",
  "م",
  "ن",
  "و",
  "ه",
  "ی",
];
