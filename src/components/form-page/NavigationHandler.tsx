import { useEffect } from "react";
import { FormPageViewDataType } from "../../@types/FormPageTypes";
import { useView } from "../../core/hooks/useView";
import { useFBControl } from "../../hooks/useFBControl";
import { ControlType } from "../../@types/controls/ControlTypes";

const NavigationHandler = ({ control }: { control: ControlType }) => {
  const { submitForm, getFormValues } = useFBControl(control);
  const { viewData } = useView<FormPageViewDataType>();

  useEffect(() => {
    viewData.submitHandler = submitForm;
    viewData.getFormValues = () => getFormValues();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <></>;
};

export default NavigationHandler;
