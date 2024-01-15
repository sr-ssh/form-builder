import { ReactNode } from "react";
import { useFBControl } from "../../../hooks/useFBControl";
import {
  ControlType,
  ControlTypeEnum,
} from "../../../@types/controls/ControlTypes";
import FormControl from "@mui/material/FormControl";
import Box from "@mui/material/Box";
import { useFormPage } from "../../../hooks/useFormPage";
import { PlaceHolderTypeEnum } from "../../../@types/controls/PlaceHolderTypes";
import Label from "./Label";
import Submit from "./Submit";
import Errors from "./Errors";
import Description from "./Description";
import File from "./File";
import { styled } from "@mui/material";

const Container = styled(Box)({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  maxWidth: "600px",
  margin: "0 auto",
  gap: 16,
});

type ControlWrapperPropsType = {
  control: ControlType;
  isFloatingBox?: boolean;
  hideQuestionNumber?: boolean;
  children?: ReactNode | Element;
};

const ControlWrapper = ({
  control,
  children,
  isFloatingBox,
  hideQuestionNumber,
}: ControlWrapperPropsType) => {
  const { getControlErrors } = useFBControl(control);
  const { getQuestionNumber, form, submitNext } = useFormPage({
    id: control.control_id,
  });

  const type = control.type;
  const hasError = !!getControlErrors()?.type;

  const isFirstPage =
    type === ControlTypeEnum.PlaceHolder &&
    control.placeholder_info?.type === PlaceHolderTypeEnum.Start;

  return (
    <Container>
      <FormControl
        error={hasError}
        sx={{ gap: 1, ...(isFirstPage ? { alignItems: "center" } : {}) }}
      >
        <Label
          control={control}
          getQuestionNumber={getQuestionNumber}
          hideQuestionNumber={hideQuestionNumber}
          isFloatingBox={isFloatingBox}
        />
        <Box display="flex" flexDirection="column">
          <Description control={control} isFloatingBox={isFloatingBox} />
          <File control={control} />
          <>{children}</>
        </Box>
        <Errors getControlErrors={getControlErrors} />
      </FormControl>
      <Submit control={control} form={form} submitNext={submitNext} />
    </Container>
  );
};

export default ControlWrapper;
