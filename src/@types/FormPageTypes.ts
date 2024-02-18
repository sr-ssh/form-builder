import {
  FieldValues,
  SubmitErrorHandler,
  SubmitHandler,
} from "react-hook-form";
import { FormValuesType } from "./FormTypes";

export type PageIndexesType = number[];

export type FormPageViewDataType = {
  indexes?: PageIndexesType;
  submitHandler?: (
    callback: SubmitHandler<FieldValues>,
    errorCallback?: SubmitErrorHandler<FormValuesType>,
  ) => (
    e?: React.BaseSyntheticEvent<object, any, any> | undefined,
  ) => Promise<void>;
  getFormValues?: () => FormValuesType;
};
