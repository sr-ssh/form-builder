import { ReactNode, createContext, memo, useEffect, useRef } from "react";
import { FormPageViewDataType, PageIndexesType } from "../@types/FormPageTypes";
import { FormStatusEnum, FormType } from "../@types/FormTypes";
import {
  getControl,
  getControlById,
  getControlParentById,
  getNextIndex,
  persianAlphabet,
  showResult,
} from "../utils/controlUtils";
import { FieldValues } from "react-hook-form";
import { closeView, openView } from "../core/utils/viewManager";
import FormPageItem from "../components/form-page/FormPageItem";
import {
  QuestionAnswerType,
  QuestionAnswerTypeEnum,
} from "../@types/AxiosApiTypes";
import { ControlTypeEnum } from "../@types/controls/ControlTypes";
import { PlaceHolderTypeEnum } from "../@types/controls/PlaceHolderTypes";
import { PageNoTypeEnum } from "../@types/controls/GroupTypes";
import { useGlobalLocales } from "../hooks/useGlobalLocales";
import { AxiosApi } from "../axios";

export type IndexListenersType = (indexes: PageIndexesType) => void;

export const FormPageContext = createContext<{
  addNewQuestion: (id: string) => string | undefined;
  addIndexListener: (listener: IndexListenersType) => void;
  form: FormType;
  submitNext: () => Promise<void> | undefined;
  submitForm: () => Promise<void> | undefined;
  gotoPrev: () => void;
  timeout: () => void;
  isPageDisabled: (id: string) => boolean;
}>({} as any);

type FormPageContextProviderProps = {
  children: ReactNode;
  form: FormType;
};

export const FormPageContextProvider = memo(
  ({ children, form }: FormPageContextProviderProps) => {
    const questionStackRef = useRef<string[][]>([]);
    const pageStackRef = useRef<FormPageViewDataType[]>([]);
    const indexListenersRef = useRef<IndexListenersType[]>([]);
    const indexesRef = useRef<PageIndexesType>([0]);
    const passedPagesRef = useRef<string[]>([]);
    const { lang } = useGlobalLocales();

    const addNewQuestion = (id: string) => {
      const control = getControlById(form.controls, id);
      const type = control?.type;
      let pagesStack = questionStackRef.current;
      if (
        (type === ControlTypeEnum.PlaceHolder &&
          control?.place_holder_info?.type !== PlaceHolderTypeEnum.Note) ||
        !control
      ) {
        if (control?.place_holder_info?.type !== PlaceHolderTypeEnum.Start) {
          pagesStack = [];
        }
        return;
      }
      if (!pagesStack.length) {
        pagesStack.push([]);
      }
      pagesStack[pagesStack.length - 1]?.push(id);
      const n = pagesStack[pagesStack.length - 1].length - 1;
      const parentControl = getControlParentById(control, form.controls, id);
      const pageNoType = parentControl?.group_info?.page_no_type;
      const parentQuestionNumber = pagesStack.length.toString();
      if (
        type === ControlTypeEnum.Group ||
        parentControl?.type !== ControlTypeEnum.Group
      ) {
        return `${parentQuestionNumber}`;
      } else {
        switch (pageNoType) {
          case PageNoTypeEnum.EnglishAlphabet:
            return `${parentQuestionNumber}.${String.fromCharCode(
              96 + (n % 26),
            )}`;
          case PageNoTypeEnum.PersianAlphabet:
            return `${parentQuestionNumber}.${persianAlphabet[(n - 1) % 32]}`;
          case PageNoTypeEnum.Number:
            return `${parentQuestionNumber}.${n.toString()}`;
          case PageNoTypeEnum.None:
          default:
            return;
        }
      }
    };

    const openPage = (indexes: number[], defaultValues?: FieldValues) => {
      const data = {
        indexes,
      };
      pageStackRef.current.push(data);
      const controlId = getControl(form.controls, indexes)?.control_id;
      openView({
        id: controlId,
        type: "FormContainer",
        data,
        component: FormPageItem,
        onClosed: () => configClose(),
      });
    };

    const closePage = (prevIndexes: PageIndexesType) => {
      const prevControl = getControl(form.controls, prevIndexes);
      const controlId = prevControl?.control_id;
      if (controlId) {
        closeView(controlId, "FormContainer");
      }
    };

    const setAnswer = (data: FieldValues) => {
      let answers: QuestionAnswerType[] = [];
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          const value = data[key];
          if (value === undefined || value === "" || value?.length === 0)
            continue;
          const isMultiValue = typeof value === "object";

          answers.push({
            control_id: key,
            answer_type: isMultiValue
              ? QuestionAnswerTypeEnum.MultiValue
              : QuestionAnswerTypeEnum.OneValue,
            ...(isMultiValue ? { values: value } : { value }),
          });
        }
      }
      return answers;
    };

    const isDisabledPage = () => {
      if (form.form_status === FormStatusEnum.Done && !form.enable_edit_form)
        return true;
      if (!form.disabled_edit_answer) return false;
      const indexes =
        pageStackRef.current[pageStackRef.current.length - 1]?.indexes;
      if (indexes) {
        const control = getControl(form.controls, indexes);
        const controlId = control?.control_id;
        if (controlId) {
          const passedPages = passedPagesRef.current;
          if (passedPages.includes(controlId)) {
            return true;
          }
        }
      }
      return false;
    };

    const isDisabledForm = () => {
      if (form.form_status === FormStatusEnum.Done) {
        return true;
      }
      return false;
    };

    const gotoNext = (data: FieldValues) => {
      if (Object.keys(data).length && !isDisabledPage()) {
        console.log("APICALL__sendAnswer", {
          form_id: form.form_id,
          answers: setAnswer(data),
        });
        AxiosApi.SendAnswer({
          form_id: form.form_id,
          answers: setAnswer(data),
        });
      }
      const controlId = getControl(
        form.controls,
        indexesRef.current,
      )?.control_id;
      const passedPages = passedPagesRef.current;
      if (controlId && !passedPages.includes(controlId)) {
        passedPages.push(controlId);
      }
      let nextIndexes = getNextIndex(form, indexesRef.current || [], data);
      if (!nextIndexes || !nextIndexes.length) {
        return;
      }
      indexesRef.current = nextIndexes;
      indexListenersRef.current.forEach((listener) => listener(nextIndexes!));
      questionStackRef.current.push([]);
      // check for which result page to show, hide and show the controls of the last page
      const result = showResult(nextIndexes, pageStackRef.current, form);
      // nextIndexes = result?.nextIndexes;
      if (result) {
        form = result.form;
      }
      openPage(nextIndexes, data);
    };

    const configClose = () => {
      form.values = {
        ...form.values,
        ...pageStackRef.current[
          pageStackRef.current.length - 1
        ]?.getFormValues?.(),
      };
      questionStackRef.current.pop();
      questionStackRef.current.pop();
      const prevIndexes = pageStackRef.current.pop()?.indexes;
      let currIndexes = pageStackRef.current[pageStackRef.current.length - 1];
      if (!currIndexes || !prevIndexes) {
        return;
      }
      indexesRef.current = currIndexes.indexes || [];
      indexListenersRef.current.forEach((listener) =>
        listener(currIndexes.indexes!),
      );
      const currentControl = getControl(
        form.controls,
        currIndexes.indexes || [],
      );
      if (
        currentControl?.place_holder_info?.type !== PlaceHolderTypeEnum.Start
      ) {
        questionStackRef.current.push([]);
      }
    };

    const gotoPrev = () => {
      // TODO apicalls???

      const prevIndexes =
        pageStackRef.current[pageStackRef.current.length - 1].indexes;
      if (!prevIndexes) return;
      closePage(prevIndexes);
    };

    const addIndexListener = (listener: IndexListenersType) => {
      indexListenersRef.current.push(listener);
    };

    const submitNext = () =>
      pageStackRef.current[pageStackRef.current.length - 1].submitHandler?.(
        (data) => gotoNext(data),
      )();

    const submitForm = async () =>
      pageStackRef.current[pageStackRef.current.length - 1].submitHandler?.(
        async (data) => {
          // if (!isDisabledForm()) {
          //   const res = await AxiosApi.DoneForm({ form_id: form.form_id });
          //   console.log(res);
          // }
          gotoNext(data);
        },
      )();

    const addSendPage = () => {
      if (isDisabledForm()) {
        return;
      }
      const controls = form.controls;
      let firstEndPlaceHolder = controls.findIndex(
        (item) =>
          item.type === ControlTypeEnum.PlaceHolder &&
          item.place_holder_info?.type === PlaceHolderTypeEnum.End,
      );
      firstEndPlaceHolder =
        firstEndPlaceHolder !== -1 ? firstEndPlaceHolder : controls.length;
      controls.splice(firstEndPlaceHolder, 0, {
        control_id: "send",
        type: ControlTypeEnum.PlaceHolder,
        label_text: lang("LAST_PAGE_LABEL"),
        place_holder_info: {
          description: lang("LAST_PAGE_DESCRIPTION"),
          type: PlaceHolderTypeEnum.End,
        },
      });
    };

    const timeout = () => {
      //call api
      // make the page
      const controls = form.controls;
      controls.push({
        control_id: "timeout",
        type: ControlTypeEnum.PlaceHolder,
        label_text: lang("PLACEHOLDER_TIMEOUT_LABEL"),
        place_holder_info: {
          description: lang("PLACEHOLDER_TIMEOUT_DESC"),
          type: PlaceHolderTypeEnum.End,
        },
      });
      //open the pages
      const nextIndexes = [form.controls.length - 1];
      indexListenersRef.current.forEach((listener) => listener(nextIndexes));
      openPage(nextIndexes);
    };

    const isPageDisabled = (id: string) => passedPagesRef.current.includes(id);

    useEffect(() => {
      document.title = form.title || "Form Builder";
      const now = Math.floor(new Date().getTime());
      if (form.end_time && form.end_time <= now) {
        timeout();
      } else {
        // addSendPage();
        openPage([0]);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <>
        <FormPageContext.Provider
          value={{
            addNewQuestion,
            addIndexListener,
            form,
            submitNext,
            submitForm,
            gotoPrev,
            timeout,
            isPageDisabled,
          }}
        >
          {children}
        </FormPageContext.Provider>
      </>
    );
  },
  () => true,
);
