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
import { FormPageViewDataType, PageIndexesType } from "../@types/FormPageTypes";
import { checkCigaretteUnit } from "./checkCigaretteUnit";

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

export const checkEmptyValue = (value: any) => {
  if (
    value === undefined ||
    value === "" ||
    (value instanceof FileList && !value.length)
  ) {
    return true;
  }
  return false;
};

const showControl = (form: FormType, parentId: string, controlId: string) => {
  form.controls.forEach((control) => {
    if (control.control_id === parentId) {
      control.group_info?.controls?.map((c) => {
        if (c.control_id === controlId) {
          c.is_hidden = false;
        }
      });
    }
  });
  return form;
};

const hideControl = (form: FormType, parentIds: string[]) => {
  form.controls.forEach((control) => {
    if (parentIds.includes(control.control_id)) {
      control.is_hidden = true;
    }
  });
  return form;
};

const showParentControl = (form: FormType, parentIds: string[]) => {
  form.controls.forEach((control) => {
    if (parentIds.includes(control.control_id)) {
      control.is_hidden = false;
    }
  });
  return form;
};

const hideAllSuggestions = (form: FormType) => {
  form.controls.forEach((control) => {
    if (
      control.control_id === "control_id_suggestions_men" ||
      control.control_id === "control_id_suggestions_women"
    ) {
      control.group_info?.controls?.map((c) => {
        c.is_hidden = true;
      });
    }
  });
  return form;
};
// check for which result page to show, hide and show the controls of the last page
export const showResult = (
  nextIndexes: PageIndexesType,
  pages: FormPageViewDataType[],
  form: FormType,
) => {
  const nextControl = getControl(form.controls, nextIndexes);
  form = hideAllSuggestions(form);

  const ageGroup = pages
    .find((page) => page.indexes?.[0] === 1)
    ?.getFormValues?.();
  const bmi =
    (ageGroup &&
      parseFloat(ageGroup.control_id_1_5?.toString() || "0") /
        ((parseFloat(ageGroup.control_id_1_4?.toString()) / 100) *
          (parseFloat(ageGroup.control_id_1_4?.toString()) / 100))) ||
    0;
  const waist = Number(ageGroup?.control_id_1_3?.toString());

  const cigaretteUnit = ageGroup
    ? checkCigaretteUnit(
        ageGroup?.control_id_1_7_1?.toString() || "0",
        parseFloat(ageGroup?.control_id_1_7_2?.toString()),
      )
    : 0;

  if (nextControl?.control_id === "control_id_suggestions_men") {
    let hasIssues = false;
    const group1Values = pages
      .find((page) => page.indexes?.[0] === 6)
      ?.getFormValues?.();
    const group2Values = pages
      .find((page) => page.indexes?.[0] === 7)
      ?.getFormValues?.();
    const group3Values = pages
      .find((page) => page.indexes?.[0] === 8)
      ?.getFormValues?.();
    if (
      group1Values &&
      (group1Values.control_id_7_1 === "0" ||
        group1Values.control_id_7_2 === "0" ||
        group1Values.control_id_7_3 === "0" ||
        group1Values.control_id_7_4 === "0" ||
        group1Values.control_id_7_5 === "0" ||
        group1Values.control_id_7_6 === "0" ||
        group1Values.control_id_7_7 === "0" ||
        group1Values.control_id_7_8 === "0" ||
        group1Values.control_id_7_9 === "0" ||
        group1Values.control_id_7_10 === "0" ||
        group1Values.control_id_7_11 === "0")
    ) {
      form = showControl(
        form,
        "control_id_suggestions_men",
        "control_id_suggestions_men_1",
      );
    } else if (
      ageGroup &&
      Number(ageGroup.control_id_1_1) >= 45 &&
      Number(ageGroup.control_id_1_1) <= 75
    ) {
      form = showControl(
        form,
        "control_id_suggestions_men",
        "control_id_suggestions_men_2",
      );
    } else if (ageGroup && Number(ageGroup.control_id_1_1) > 75) {
      form = showControl(
        form,
        "control_id_suggestions_men",
        "control_id_suggestions_men_2_2",
      );
    } else {
      form = showControl(
        form,
        "control_id_suggestions_men",
        "control_id_suggestions_men_2_1",
      );
    }

    if (
      group2Values &&
      (group2Values.control_id_8_3 === "0" ||
        group2Values.control_id_8_4 === "0" ||
        group2Values.control_id_8_5 === "0" ||
        group2Values.control_id_8_6 === "0" ||
        group2Values.control_id_8_7 === "0" ||
        bmi > 25 ||
        waist > 102)
    ) {
      form = showControl(
        form,
        "control_id_suggestions_men",
        "control_id_suggestions_men_3",
      );
    } else {
      form = showControl(
        form,
        "control_id_suggestions_men",
        "control_id_suggestions_men_3_1",
      );
    }
    if (
      group3Values &&
      (group3Values.control_id_9_1 === "0" ||
        group3Values.control_id_9_2 === "0")
    ) {
      form = showControl(
        form,
        "control_id_suggestions_men",
        "control_id_suggestions_men_4",
      );
    } else if (
      ageGroup &&
      Number(ageGroup.control_id_1_1) >= 50 &&
      Number(ageGroup.control_id_1_1) <= 69
    ) {
      form = showControl(
        form,
        "control_id_suggestions_men",
        "control_id_suggestions_men_5",
      );
    } else if (ageGroup && Number(ageGroup.control_id_1_1) > 69) {
      form = showControl(
        form,
        "control_id_suggestions_men",
        "control_id_suggestions_men_5_2",
      );
    } else {
      form = showControl(
        form,
        "control_id_suggestions_men",
        "control_id_suggestions_men_5_1",
      );
    }
    if (ageGroup && ageGroup.control_id_1_6 !== "0" && cigaretteUnit > 20) {
      hasIssues = true;
      form = showControl(
        form,
        "control_id_suggestions_men",
        "control_id_suggestions_men_6",
      );
    } else {
      form = showControl(
        form,
        "control_id_suggestions_men",
        "control_id_suggestions_men_7",
      );
    }
    return { form, nextIndexes };
  }
  if (nextControl?.control_id === "control_id_suggestions_women") {
    let hasIssues = false;
    const group1Values = pages
      .find((page) => page.indexes?.[0] === 2)
      ?.getFormValues?.();
    const group2Values = pages
      .find((page) => page.indexes?.[0] === 3)
      ?.getFormValues?.();
    const group3Values = pages
      .find((page) => page.indexes?.[0] === 4)
      ?.getFormValues?.();
    const group4Values = pages
      .find((page) => page.indexes?.[0] === 5)
      ?.getFormValues?.();
    if (
      group1Values &&
      (group1Values.control_id_2_1 === "0" ||
        group1Values.control_id_2_2 === "0" ||
        group1Values.control_id_2_3 === "0" ||
        group1Values.control_id_2_4 === "0" ||
        group1Values.control_id_2_5 === "0" ||
        group1Values.control_id_2_6 === "0" ||
        group1Values.control_id_2_7 === "0" ||
        group1Values.control_id_2_8 === "0" ||
        group1Values.control_id_2_9 === "0" ||
        group1Values.control_id_2_10 === "0" ||
        group1Values.control_id_2_11 === "0")
    ) {
      form = showControl(
        form,
        "control_id_suggestions_women",
        "control_id_suggestions_women_1",
      );
    } else if (
      ageGroup &&
      Number(ageGroup.control_id_1_1) >= 45 &&
      Number(ageGroup.control_id_1_1) <= 75
    ) {
      form = showControl(
        form,
        "control_id_suggestions_women",
        "control_id_suggestions_women_2",
      );
    } else if (ageGroup && Number(ageGroup.control_id_1_1) > 75) {
      form = showControl(
        form,
        "control_id_suggestions_women",
        "control_id_suggestions_women_2_2",
      );
    } else {
      form = showControl(
        form,
        "control_id_suggestions_women",
        "control_id_suggestions_women_2_1",
      );
    }
    if (
      (group2Values &&
        (group2Values.control_id_3_3 === "0" ||
          group2Values.control_id_3_4 === "0" ||
          group2Values.control_id_3_5 === "0" ||
          group2Values.control_id_3_6 === "0" ||
          group2Values.control_id_3_7 === "0")) ||
      bmi > 25 ||
      waist > 90
    ) {
      hasIssues = true;
      form = showControl(
        form,
        "control_id_suggestions_women",
        "control_id_suggestions_women_3",
      );
    } else {
      form = showControl(
        form,
        "control_id_suggestions_women",
        "control_id_suggestions_women_3_1",
      );
    }
    if (
      group3Values &&
      (group3Values.control_id_4_1 === "0" ||
        group3Values.control_id_4_2 === "0")
    ) {
      hasIssues = true;
      form = showControl(
        form,
        "control_id_suggestions_women",
        "control_id_suggestions_women_4",
      );
    } else if (
      ageGroup &&
      Number(ageGroup.control_id_1_1) >= 40 &&
      Number(ageGroup.control_id_1_1) <= 75
    ) {
      hasIssues = true;
      form = showControl(
        form,
        "control_id_suggestions_women",
        "control_id_suggestions_women_5",
      );
    } else if (ageGroup && Number(ageGroup.control_id_1_1) > 75) {
      hasIssues = true;
      form = showControl(
        form,
        "control_id_suggestions_women",
        "control_id_suggestions_women_5_2",
      );
    } else {
      form = showControl(
        form,
        "control_id_suggestions_women",
        "control_id_suggestions_women_5_1",
      );
    }
    if (group4Values && group4Values.control_id_5_1 === "0") {
      hasIssues = true;
      form = showControl(
        form,
        "control_id_suggestions_women",
        "control_id_suggestions_women_6",
      );
    } else if (
      ageGroup &&
      Number(ageGroup.control_id_1_1) >= 21 &&
      Number(ageGroup.control_id_1_1) <= 65
    ) {
      hasIssues = true;
      form = showControl(
        form,
        "control_id_suggestions_women",
        "control_id_suggestions_women_7",
      );
    } else if (ageGroup && Number(ageGroup.control_id_1_1) > 65) {
      hasIssues = true;
      form = showControl(
        form,
        "control_id_suggestions_women",
        "control_id_suggestions_women_7_2",
      );
    } else {
      form = showControl(
        form,
        "control_id_suggestions_women",
        "control_id_suggestions_women_7_1",
      );
    }
    if (ageGroup && ageGroup.control_id_1_6 !== "0" && cigaretteUnit > 20) {
      hasIssues = true;
      form = showControl(
        form,
        "control_id_suggestions_women",
        "control_id_suggestions_women_8",
      );
    } else {
      form = showControl(
        form,
        "control_id_suggestions_women",
        "control_id_suggestions_women_9",
      );
    }
    return { form, nextIndexes };
  } else return { form, nextIndexes };
};

export const showPagesBasedOnAge = (
  nextIndexes: PageIndexesType,
  pages: FormPageViewDataType[],
  form: FormType,
) => {
  const nextControlId = getControl(form.controls, nextIndexes)?.control_id;
  if (
    !nextControlId ||
    (nextControlId !== "control_id_2" && nextControlId !== "control_id_7")
  )
    return { form, nextIndexes };
  form = hideAllSuggestions(form);
  const infoGroup = pages
    .find((page) => page.indexes?.[0] === 1)
    ?.getFormValues?.();
  if (!infoGroup) return { form, nextIndexes };
  const sex = infoGroup.control_id_1_2;
  const age = infoGroup.control_id_1_1;
  if (sex === "0") {
    form = hideControl(form, ["control_id_suggestions_men"]);
    form = hideControl(form, ["control_id_7", "control_id_8", "control_id_9"]);
    if (Number(age) > 75) {
      return {
        form: hideControl(form, [
          "control_id_2",
          "control_id_4",
          "control_id_5",
        ]),
        nextIndexes: [3],
      };
    } else if (Number(age) > 65) {
      return { form: hideControl(form, ["control_id_5"]), nextIndexes };
    }
    return { form, nextIndexes };
  } else {
    form = hideControl(form, ["control_id_suggestions_women"]);
    if (Number(age) > 75) {
      return {
        form: hideControl(form, ["control_id_7", "control_id_9"]),
        nextIndexes: [7],
      };
    } else if (Number(age) > 69) {
      return { form: hideControl(form, ["control_id_9"]), nextIndexes };
    }
    return { form, nextIndexes };
  }
};

export const setSteps = (pages: FormPageViewDataType[]) => {
  const infoGroup = pages
    .find((page) => page.indexes?.[0] === 1)
    ?.getFormValues?.();
  if (!infoGroup) return [];
  const sex = infoGroup.control_id_1_2;
  const age = infoGroup.control_id_1_1;
  if (sex === "0") {
    if (Number(age) >= 75) {
      return ["کبد"];
    } else if (Number(age) >= 65) {
      return ["گوارش", "کبد", "سینه"];
    }
    return ["گوارش", "کبد", "سینه", "گردن رحم"];
  } else {
    if (Number(age) >= 75) {
      return ["کبد"];
    } else if (Number(age) >= 69) {
      return ["گوارش", "کبد"];
    }
    return ["گوارش", "کبد", "پروستات"];
  }
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
