import { useView } from "../../core/hooks/useView";
import { getControl } from "../../utils/controlUtils";
import ControlSelector from "./ControlSelector";
import ControlWrapper from "./control-wrapper/ControlWrapper";
import { FBContextProvider } from "../../context/FBContextProvider";
import { FormPageViewDataType } from "../../@types/FormPageTypes";
import NavigationHandler from "./NavigationHandler";
import { useFormPage } from "../../hooks/useFormPage";

const FormPageItem = () => {
  const { viewData } = useView<FormPageViewDataType>();
  const { indexes } = viewData;
  const { form } = useFormPage({});
  const control = getControl(form?.controls || [], indexes || []);
  if (!form || !indexes || indexes.length < 1 || !control) {
    return <></>;
  }
  return (
    <FBContextProvider control={control} defaultValues={form.values}>
      <NavigationHandler control={control} />
      <ControlWrapper
        control={control}
        isFloatingBox={form.layout?.floating_box}
        hideQuestionNumber={form.hide_question_number}
      >
        <ControlSelector
          control={control}
          isFloatingBox={form.layout?.floating_box}
          hideQuestionNumber={form.hide_question_number}
        />
      </ControlWrapper>
    </FBContextProvider>
  );
};

export default FormPageItem;
