import { useContext, useEffect } from "react";
import {
  FormPageContext,
  IndexListenersType,
} from "../context/FormPageContextProvider";

export const useFormPage = ({
  onIndexChanged,
  id,
}: {
  onIndexChanged?: IndexListenersType;
  id?: string;
}) => {
  const {
    addIndexListener,
    form,
    submitForm,
    submitNext,
    addNewQuestion,
    gotoPrev,
    timeout,
    isPageDisabled,
    getSteps,
  } = useContext(FormPageContext);

  useEffect(() => {
    onIndexChanged && addIndexListener(onIndexChanged);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    form,
    submitForm,
    submitNext,
    getQuestionNumber: () => id && addNewQuestion(id),
    gotoPrev,
    timeout,
    isPageDisabled: () => id && isPageDisabled(id),
    getSteps,
  };
};
