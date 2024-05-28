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
      control.group_info?.controls?.forEach((c) => {
        c.is_hidden = true;
      });
    }
  });
  return form;
};

function calcFraminghamRiskScore(
  age: number,
  sex: string,
  hdl: number,
  bloodPressure: number,
  isTreated: boolean,
  cholesterol: number,
  isSmoker: boolean,
): number {
  // Calculate risk based on age and sex
  let ageRisk: number;
  if (sex === "Women") {
    if (age >= 20 && age <= 34) ageRisk = -7;
    else if (age >= 35 && age <= 39) ageRisk = -3;
    else if (age >= 40 && age <= 44) ageRisk = 0;
    else if (age >= 45 && age <= 49) ageRisk = 3;
    else if (age >= 50 && age <= 54) ageRisk = 6;
    else if (age >= 55 && age <= 59) ageRisk = 8;
    else if (age >= 60 && age <= 64) ageRisk = 10;
    else if (age >= 65 && age <= 69) ageRisk = 12;
    else if (age >= 70 && age <= 74) ageRisk = 14;
    else if (age >= 75 && age <= 79) ageRisk = 16;
    else ageRisk = 0; // Default risk if age is outside the provided ranges
  } else if (sex === "Men") {
    if (age >= 20 && age <= 34) ageRisk = -9;
    else if (age >= 35 && age <= 39) ageRisk = -4;
    else if (age >= 40 && age <= 44) ageRisk = 0;
    else if (age >= 45 && age <= 49) ageRisk = 3;
    else if (age >= 50 && age <= 54) ageRisk = 6;
    else if (age >= 55 && age <= 59) ageRisk = 8;
    else if (age >= 60 && age <= 64) ageRisk = 10;
    else if (age >= 65 && age <= 69) ageRisk = 11;
    else if (age >= 70 && age <= 74) ageRisk = 12;
    else if (age >= 75 && age <= 79) ageRisk = 13;
    else ageRisk = 0; // Default risk if age is outside the provided ranges
  } else {
    ageRisk = 0; // Default risk for unknown sex
  }

  // Calculate risk based on HDL
  let hdlRisk: number;
  if (hdl >= 60) hdlRisk = -1;
  else if (hdl >= 50 && hdl <= 59) hdlRisk = 0;
  else if (hdl >= 40 && hdl <= 49) hdlRisk = 1;
  else if (hdl < 40) hdlRisk = 2;
  else hdlRisk = 0; // Default risk if HDL is outside the provided ranges

  // Calculate risk based on systolic blood pressure
  let bpRisk: number;
  if (bloodPressure <= 120) {
    bpRisk = 0;
  } else if (bloodPressure >= 120 && bloodPressure <= 129) {
    if (sex === "Men") {
      bpRisk = isTreated ? 1 : 0;
    } else {
      bpRisk = isTreated ? 3 : 1;
    }
  } else if (bloodPressure >= 130 && bloodPressure <= 139) {
    if (sex === "Men") {
      bpRisk = isTreated ? 2 : 1;
    } else {
      bpRisk = isTreated ? 4 : 2;
    }
  } else if (bloodPressure >= 140 && bloodPressure <= 159) {
    if (sex === "Men") {
      bpRisk = isTreated ? 2 : 1;
    } else {
      bpRisk = isTreated ? 5 : 3;
    }
  } else if (bloodPressure >= 160) {
    if (sex === "Men") {
      bpRisk = isTreated ? 3 : 2;
    } else {
      bpRisk = isTreated ? 6 : 4;
    }
  } else bpRisk = 0; // Default risk for unknown blood pressure range

  // Calculate risk based on cholesterol
  let cholesterolRisk: number;
  if (sex === "Women") {
    if (cholesterol < 160) cholesterolRisk = 0;
    else if (cholesterol >= 160 && cholesterol <= 199) {
      if (age >= 20 && age <= 39) {
        cholesterolRisk = 4;
      } else if (age >= 40 && age <= 49) {
        cholesterolRisk = 3;
      } else if (age >= 50 && age <= 59) {
        cholesterolRisk = 2;
      } else if (age >= 60 && age <= 79) {
        cholesterolRisk = 1;
      } else {
        cholesterolRisk = 0;
      }
    } else if (cholesterol >= 200 && cholesterol <= 239) {
      if (age >= 20 && age <= 39) {
        cholesterolRisk = 8;
      } else if (age >= 40 && age <= 49) {
        cholesterolRisk = 6;
      } else if (age >= 50 && age <= 59) {
        cholesterolRisk = 4;
      } else if (age >= 60 && age <= 69) {
        cholesterolRisk = 2;
      } else if (age >= 70 && age <= 79) {
        cholesterolRisk = 1;
      } else {
        cholesterolRisk = 0;
      }
    } else if (cholesterol >= 240 && cholesterol <= 279) {
      if (age >= 20 && age <= 39) {
        cholesterolRisk = 11;
      } else if (age >= 40 && age <= 49) {
        cholesterolRisk = 8;
      } else if (age >= 50 && age <= 59) {
        cholesterolRisk = 5;
      } else if (age >= 60 && age <= 69) {
        cholesterolRisk = 3;
      } else if (age >= 70 && age <= 79) {
        cholesterolRisk = 2;
      } else {
        cholesterolRisk = 0;
      }
    } else if (cholesterol >= 280) {
      if (age >= 20 && age <= 39) {
        cholesterolRisk = 13;
      } else if (age >= 40 && age <= 49) {
        cholesterolRisk = 10;
      } else if (age >= 50 && age <= 59) {
        cholesterolRisk = 7;
      } else if (age >= 60 && age <= 69) {
        cholesterolRisk = 4;
      } else if (age >= 70 && age <= 79) {
        cholesterolRisk = 2;
      } else {
        cholesterolRisk = 0;
      }
    } else cholesterolRisk = 0; // Default risk if cholesterol is outside the provided ranges
  } else if (sex === "Men") {
    if (cholesterol < 160) cholesterolRisk = 0;
    else if (cholesterol >= 160 && cholesterol <= 199) {
      if (age >= 20 && age <= 39) {
        cholesterolRisk = 4;
      } else if (age >= 40 && age <= 49) {
        cholesterolRisk = 3;
      } else if (age >= 50 && age <= 59) {
        cholesterolRisk = 2;
      } else if (age >= 60 && age <= 69) {
        cholesterolRisk = 1;
      } else if (age >= 70 && age <= 79) {
        cholesterolRisk = 0;
      } else {
        cholesterolRisk = 0;
      }
    } else if (cholesterol >= 200 && cholesterol <= 239) {
      if (age >= 20 && age <= 39) {
        cholesterolRisk = 7;
      } else if (age >= 40 && age <= 49) {
        cholesterolRisk = 5;
      } else if (age >= 50 && age <= 59) {
        cholesterolRisk = 3;
      } else if (age >= 60 && age <= 69) {
        cholesterolRisk = 1;
      } else if (age >= 70 && age <= 79) {
        cholesterolRisk = 0;
      } else {
        cholesterolRisk = 0;
      }
    } else if (cholesterol >= 240 && cholesterol <= 279) {
      if (age >= 20 && age <= 39) {
        cholesterolRisk = 9;
      } else if (age >= 40 && age <= 49) {
        cholesterolRisk = 6;
      } else if (age >= 50 && age <= 59) {
        cholesterolRisk = 4;
      } else if (age >= 60 && age <= 69) {
        cholesterolRisk = 2;
      } else if (age >= 70 && age <= 79) {
        cholesterolRisk = 1;
      } else {
        cholesterolRisk = 0;
      }
    } else if (cholesterol >= 280) {
      if (age >= 20 && age <= 39) {
        cholesterolRisk = 11;
      } else if (age >= 40 && age <= 49) {
        cholesterolRisk = 8;
      } else if (age >= 50 && age <= 59) {
        cholesterolRisk = 5;
      } else if (age >= 60 && age <= 69) {
        cholesterolRisk = 3;
      } else if (age >= 70 && age <= 79) {
        cholesterolRisk = 1;
      } else {
        cholesterolRisk = 0;
      }
    } else cholesterolRisk = 0; // Default risk if cholesterol is outside the provided ranges
  } else {
    cholesterolRisk = 0; // Default risk for unknown sex
  }

  // Calculate risk based on smoking status
  let smokingRisk: number;
  if (isSmoker) {
    if (sex === "Women") {
      if (age >= 20 && age <= 39) {
        smokingRisk = 9;
      } else if (age >= 40 && age <= 49) {
        smokingRisk = 7;
      } else if (age >= 50 && age <= 59) {
        smokingRisk = 4;
      } else if (age >= 60 && age <= 69) {
        smokingRisk = 2;
      } else if (age >= 70 && age <= 79) {
        smokingRisk = 1;
      } else {
        smokingRisk = 0;
      }
    } else if (sex === "Men") {
      if (age >= 20 && age <= 39) {
        smokingRisk = 8;
      } else if (age >= 40 && age <= 49) {
        smokingRisk = 5;
      } else if (age >= 50 && age <= 59) {
        smokingRisk = 3;
      } else if (age >= 60 && age <= 69) {
        smokingRisk = 1;
      } else if (age >= 70 && age <= 79) {
        smokingRisk = 1;
      } else {
        smokingRisk = 0;
      }
    } else smokingRisk = 0; // Default risk for unknown sex
  } else {
    smokingRisk = 0; // Default risk if not a smoker
  }

  // Calculate total risk
  const totalRisk = ageRisk + hdlRisk + bpRisk + cholesterolRisk + smokingRisk;

  // Calculate risk based on cholesterol
  let tenYearRisk: number;
  if (sex === "Women") {
    if (totalRisk < 0) tenYearRisk = 1;
    else if (totalRisk >= 0 && totalRisk <= 12) tenYearRisk = 1;
    else if (totalRisk === 13 || totalRisk === 14) tenYearRisk = 2;
    else if (totalRisk === 15) tenYearRisk = 3;
    else if (totalRisk === 16) tenYearRisk = 4;
    else if (totalRisk === 17) tenYearRisk = 5;
    else if (totalRisk === 18) tenYearRisk = 6;
    else if (totalRisk === 19) tenYearRisk = 8;
    else if (totalRisk === 20) tenYearRisk = 11;
    else if (totalRisk === 21) tenYearRisk = 14;
    else if (totalRisk === 22) tenYearRisk = 17;
    else if (totalRisk === 23) tenYearRisk = 22;
    else if (totalRisk === 24) tenYearRisk = 27;
    else tenYearRisk = 30;
  } else if (sex === "Men") {
    if (totalRisk < 0) tenYearRisk = 1;
    else if (totalRisk >= 0 && totalRisk <= 4) tenYearRisk = 1;
    else if (totalRisk === 5 || totalRisk === 6) tenYearRisk = 2;
    else if (totalRisk === 7) tenYearRisk = 3;
    else if (totalRisk === 8) tenYearRisk = 4;
    else if (totalRisk === 9) tenYearRisk = 5;
    else if (totalRisk === 10) tenYearRisk = 6;
    else if (totalRisk === 11) tenYearRisk = 8;
    else if (totalRisk === 12) tenYearRisk = 10;
    else if (totalRisk === 13) tenYearRisk = 12;
    else if (totalRisk === 14) tenYearRisk = 16;
    else if (totalRisk === 15) tenYearRisk = 20;
    else if (totalRisk === 16) tenYearRisk = 25;
    else tenYearRisk = 30;
  } else {
    tenYearRisk = 0; // Default risk for unknown sex
  }

  console.log(tenYearRisk, totalRisk);

  // Return the total risk
  return tenYearRisk;
}

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
    const group1Values = pages
      .find((page) => page.indexes?.[0] === 8)
      ?.getFormValues?.();
    const group2Values = pages
      .find((page) => page.indexes?.[0] === 9)
      ?.getFormValues?.();
    const group3Values = pages
      .find((page) => page.indexes?.[0] === 10)
      ?.getFormValues?.();
    const group4Values = pages
      .find((page) => page.indexes?.[0] === 11)
      ?.getFormValues?.();
    const group5Values = pages
      .find((page) => page.indexes?.[0] === 12)
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
    if (
      group4Values &&
      (group4Values.control_id_10_1 === "0" ||
        group4Values.control_id_10_2 === "0" ||
        group4Values.control_id_10_3 === "0" ||
        group4Values.control_id_10_4 === "0" ||
        group4Values.control_id_10_5 === "0" ||
        group4Values.control_id_10_6 === "0" ||
        group4Values.control_id_10_7 === "0")
    ) {
      form = showControl(
        form,
        "control_id_suggestions_men",
        "control_id_suggestions_men_8",
      );
    } else {
      form = showControl(
        form,
        "control_id_suggestions_men",
        "control_id_suggestions_men_8_1",
      );
    }
    if (ageGroup && group5Values) {
      const fScore = calcFraminghamRiskScore(
        Number(ageGroup.control_id_1_1),
        ageGroup.control_id_1_2 === "0" ? "Women" : "Men",
        Number(group5Values.control_id_11_2_2),
        Number(group5Values.control_id_11_4),
        group5Values.control_id_11_3 !== "0",
        Number(group5Values.control_id_11_2_1),
        ageGroup.control_id_1_6 !== "0",
      );

      if (
        group5Values &&
        (group5Values.control_id_11_5 === "0" ||
          group5Values.control_id_11_6 === "0" ||
          fScore > 10)
      ) {
        form = showControl(
          form,
          "control_id_suggestions_men",
          "control_id_suggestions_men_9",
        );
      } else {
        form = showControl(
          form,
          "control_id_suggestions_men",
          "control_id_suggestions_men_9_1",
        );
      }
    }
    return { form, nextIndexes };
  }
  if (nextControl?.control_id === "control_id_suggestions_women") {
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
    const group5Values = pages
      .find((page) => page.indexes?.[0] === 6)
      ?.getFormValues?.();
    const group6Values = pages
      .find((page) => page.indexes?.[0] === 7)
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
      form = showControl(
        form,
        "control_id_suggestions_women",
        "control_id_suggestions_women_5",
      );
    } else if (ageGroup && Number(ageGroup.control_id_1_1) > 75) {
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
      form = showControl(
        form,
        "control_id_suggestions_women",
        "control_id_suggestions_women_7",
      );
    } else if (ageGroup && Number(ageGroup.control_id_1_1) > 65) {
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
    if (
      group5Values &&
      (group5Values.control_id_6_1 === "0" ||
        group5Values.control_id_6_2 === "0" ||
        group5Values.control_id_6_3 === "0" ||
        group5Values.control_id_6_4 === "0" ||
        group5Values.control_id_6_5 === "0" ||
        group5Values.control_id_6_6 === "0" ||
        group5Values.control_id_6_7 === "0")
    ) {
      form = showControl(
        form,
        "control_id_suggestions_women",
        "control_id_suggestions_women_10",
      );
    } else {
      form = showControl(
        form,
        "control_id_suggestions_women",
        "control_id_suggestions_women_10_1",
      );
    }
    if (ageGroup && group6Values) {
      const fScore = calcFraminghamRiskScore(
        Number(ageGroup.control_id_1_1),
        ageGroup.control_id_1_2 === "0" ? "Women" : "Men",
        Number(group6Values.control_id_11_2_2),
        Number(group6Values.control_id_11_4),
        group6Values.control_id_11_3 !== "0",
        Number(group6Values.control_id_11_2_1),
        ageGroup.control_id_1_6 !== "0",
      );

      if (
        group6Values &&
        (group6Values.control_id_11_5 === "0" ||
          group6Values.control_id_11_6 === "0" ||
          fScore > 10)
      ) {
        form = showControl(
          form,
          "control_id_suggestions_women",
          "control_id_suggestions_women_11",
        );
      } else {
        form = showControl(
          form,
          "control_id_suggestions_women",
          "control_id_suggestions_women_11_1",
        );
      }
    }
    if (ageGroup && ageGroup.control_id_1_6 !== "0" && cigaretteUnit > 20) {
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
    form = hideControl(form, [
      "control_id_7",
      "control_id_8",
      "control_id_9",
      "control_id_10",
      "control_id_12",
    ]);
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
        nextIndexes: [9],
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
      return ["کبد", "اعصاب و روان", "قلبی عروقی"];
    } else if (Number(age) >= 65) {
      return ["گوارش", "کبد", "سینه", "اعصاب و روان", "قلبی عروقی"];
    }
    return ["گوارش", "کبد", "سینه", "گردن رحم", "اعصاب و روان", "قلبی عروقی"];
  } else {
    if (Number(age) >= 75) {
      return ["کبد", "اعصاب و روان", "قلبی عروقی"];
    } else if (Number(age) >= 69) {
      return ["گوارش", "کبد", "اعصاب و روان", "قلبی عروقی"];
    }
    return ["گوارش", "کبد", "پروستات", "اعصاب و روان", "قلبی عروقی"];
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
