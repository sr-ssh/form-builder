import { FormType } from "../@types/FormTypes";
import { PlaceHolderTypeEnum } from "../@types/controls/PlaceHolderTypes";

export const getProgress = (form: FormType, indexes: number[]) => {
  let leftControls = 0;
  let allControls = 0;
  for (let i = 0; i < form.controls.length; i++) {
    const control = form.controls[i];
    const placeHolderType = control.placeholder_info?.type;
    if (
      !control.is_hidden &&
      placeHolderType !== PlaceHolderTypeEnum.Start &&
      placeHolderType !== PlaceHolderTypeEnum.End
    ) {
      allControls++;
      if (i >= indexes[0]) {
        leftControls++;
      }
    }
  }
  const thisControl = allControls - leftControls + 1;
  return {
    progress: ((allControls - leftControls) / allControls) * 100,
    thisPage: thisControl > allControls ? allControls : thisControl,
    allPages: allControls,
  };
};
