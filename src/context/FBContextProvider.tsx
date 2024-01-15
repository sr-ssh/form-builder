import { ReactNode, createContext, memo, useRef } from "react";
import { ControlType, ControlTypeEnum } from "../@types/controls/ControlTypes";
import {
  FieldError,
  FieldErrorsImpl,
  FieldValues,
  Merge,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { getValidationObject } from "../utils/getValidationObject";
import {
  getControlById,
  getControlParentById,
  getDefaultValues,
  hideControlsWithConditionOn,
  passCondition,
  updateArrayWithControlId,
} from "../utils/controlUtils";
import { useFormPage } from "../hooks/useFormPage";
import { AxiosApi } from "../axios";
import { FormStatusEnum, FormValuesType } from "../@types/FormTypes";

export const FBContext = createContext<{
  registerControl: (control: ControlType) => any;
  getControlErrors: (
    id: string,
  ) => FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined;
  submitForm: (
    callback: SubmitHandler<FieldValues>,
  ) => (
    e?: React.BaseSyntheticEvent<object, any, any> | undefined,
  ) => Promise<void>;
  registerFormSet: (
    listenControlChanges: (newControls: ControlType[]) => void,
    id: string,
  ) => void;
  getDefaultValue: (controlId: string) => void;
  getFormValues: () => FormValuesType;
  isDisabled: () => boolean;
}>({} as any);

export const FBContextProvider = memo(
  ({
    control,
    defaultValues,
    children,
  }: {
    control: ControlType;
    defaultValues: FormValuesType;
    children: ReactNode;
  }) => {
    const mainControlRef = useRef<ControlType>(control);
    const controlDefaultValues = useRef<FormValuesType>(
      getDefaultValues(control, defaultValues),
    );
    const formSetListenRef = useRef<{
      [control_id: string]: {
        listenControlChanges: (newControls: ControlType[]) => void;
      };
    }>({});
    const { form } = useFormPage({});
    const { submitNext, isPageDisabled } = useFormPage({
      id: getControlParentById(control, form.controls, control.control_id)
        ?.control_id,
    });

    const formController = useForm({
      defaultValues: controlDefaultValues.current,
      mode: "onBlur",
    });

    const handleEventId = (
      value: string | number,
      thisControl: ControlType,
      formSet: ControlType,
    ) => {
      if (value !== undefined && thisControl.event_id) {
        // get the controls from api
        if (thisControl.control_id !== "control_id_province") return; // TODO remove this after real api added
        let newControls = AxiosApi.FakeGetEventControls(value);

        let groupControls = hideControlsWithConditionOn(
          formSet.group_info?.controls || [],
        );
        if (newControls?.length) {
          groupControls = updateArrayWithControlId(groupControls, newControls);
          formSetListenRef.current[formSet.control_id]?.listenControlChanges(
            groupControls,
          );
        }
      }
    };

    const handleCondition = (
      thisControl: ControlType,
      value: any,
      name: string,
      formSet: ControlType,
    ) => {
      if (!thisControl?.conditions || !formSet?.group_info?.controls) return;

      const thenShowControlId = passCondition(thisControl?.conditions, {
        [name]: value,
      });
      let groupControls = hideControlsWithConditionOn(
        formSet.group_info?.controls,
      );
      if (thenShowControlId) {
        const thenControl = groupControls.find(
          (item) => item.control_id === thenShowControlId,
        );
        if (thenControl) {
          thenControl.is_hidden = false;
        }
      }
      if (thisControl?.conditions) {
        formSetListenRef.current[formSet.control_id]?.listenControlChanges(
          groupControls,
        );
      }
    };

    const onChangedControlValue = (target: any) => {
      const value =
        target.value !== undefined ? target.value : target.files?.[0];
      let controls = mainControlRef.current.group_info?.controls;
      const thisControl =
        getControlById(controls || [], target.name) || mainControlRef.current;
      if (
        thisControl.type === ControlTypeEnum.DatePicker ||
        (thisControl.type === ControlTypeEnum.MultipleOption &&
          thisControl.multiple_option_info?.multi_select === false)
      ) {
        formController.setValue(target.name, value);
      }
      if (controls) {
        const formSet = getControlParentById(
          mainControlRef.current,
          controls,
          target.name,
        );
        if (!formSet) return;
        handleCondition(thisControl, value, target.name, formSet);
        handleEventId(value, thisControl, formSet);
      } else if (value !== undefined || target.files?.[0]) {
        const type = mainControlRef.current.type;
        const parent = getControlParentById(
          control,
          form.controls,
          control.control_id,
        );
        const hasSubmitButton =
          parent?.type !== ControlTypeEnum.Group &&
          type !== ControlTypeEnum.DatePicker &&
          type !== ControlTypeEnum.PlaceHolder &&
          type !== ControlTypeEnum.TextArea &&
          type !== ControlTypeEnum.TextBox;

        if (hasSubmitButton) {
          submitNext();
        }
      }
    };

    const registerControl = (control: ControlType) =>
      formController.register(control.control_id, {
        ...getValidationObject(control, form.required_answer),
        onChange: (e) => {
          onChangedControlValue(e.target);
        },
      });

    const registerFormSet = (
      listenControlChanges: (newControls: ControlType[]) => void,
      id: string,
    ) => {
      formSetListenRef.current[id] = { listenControlChanges };
    };

    const isDisabled = () => {
      if (!form.enable_edit_form && form.form_status === FormStatusEnum.Done)
        return true;
      if (!form.disabled_edit_answer) return false;
      if (formController.formState.isSubmitted || isPageDisabled()) {
        return true;
      }
      return false;
    };

    const submitForm = (callback: SubmitHandler<FieldValues>) =>
      formController.handleSubmit(callback);

    const getControlErrors = (id: string) =>
      formController.formState.errors[id];

    const getDefaultValue = (controlId: string) =>
      controlDefaultValues.current[controlId];

    const getFormValues = () => formController.getValues();

    return (
      <>
        <FBContext.Provider
          value={{
            registerControl,
            getControlErrors,
            submitForm,
            registerFormSet,
            getDefaultValue,
            getFormValues,
            isDisabled,
          }}
        >
          {children}
        </FBContext.Provider>
      </>
    );
  },
  () => true,
);
