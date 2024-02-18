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
import { Paper, styled, useTheme } from "@mui/material";

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
  const theme = useTheme();

  const type = control.type;
  const hasError = !!getControlErrors()?.type;

  const isFirstPage =
    type === ControlTypeEnum.PlaceHolder &&
    control.place_holder_info?.type === PlaceHolderTypeEnum.Start;

  let paperBorderColor;
  if (
    control.control_id === "control_id_suggestions_men_1" ||
    control.control_id === "control_id_suggestions_men_3" ||
    control.control_id === "control_id_suggestions_men_4" ||
    control.control_id === "control_id_suggestions_men_6" ||
    control.control_id === "control_id_suggestions_women_1" ||
    control.control_id === "control_id_suggestions_women_3" ||
    control.control_id === "control_id_suggestions_women_4" ||
    control.control_id === "control_id_suggestions_women_6" ||
    control.control_id === "control_id_suggestions_women_8"
  ) {
    paperBorderColor = "#E72828";
  } else if (
    control.control_id === "control_id_suggestions_men_2" ||
    control.control_id === "control_id_suggestions_men_5" ||
    control.control_id === "control_id_suggestions_women_2" ||
    control.control_id === "control_id_suggestions_women_5" ||
    control.control_id === "control_id_suggestions_women_7"
  ) {
    paperBorderColor = "#FF971C";
  } else if (
    control.control_id === "control_id_suggestions_women_2_2" ||
    control.control_id === "control_id_suggestions_women_5_2" ||
    control.control_id === "control_id_suggestions_women_7_2" ||
    control.control_id === "control_id_suggestions_men_2_2" ||
    control.control_id === "control_id_suggestions_men_5_2"
  ) {
    paperBorderColor = theme.palette.info.main;
  } else {
    paperBorderColor = "#00BD62";
  }

  return (
    <Container>
      {control.place_holder_info?.type === PlaceHolderTypeEnum.Note ? (
        <Paper
          elevation={1}
          sx={{ borderBlockStart: `6px solid ${paperBorderColor}` }}
        >
          <FormControl
            error={hasError}
            sx={{ gap: 1, ...(isFirstPage ? { alignItems: "center" } : {}) }}
          >
            <Box marginBlockStart={2} marginInlineStart={2}>
              <Label
                control={control}
                getQuestionNumber={getQuestionNumber}
                hideQuestionNumber={hideQuestionNumber}
                isFloatingBox={isFloatingBox}
              />
            </Box>

            <Box display="flex" flexDirection="column">
              <Description control={control} isFloatingBox={isFloatingBox} />
              <File control={control} />
              <>{children}</>
            </Box>
            <Errors getControlErrors={getControlErrors} />
          </FormControl>
        </Paper>
      ) : (
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
      )}

      {/* <Submit control={control} form={form} submitNext={submitNext} /> */}
    </Container>
  );
};

export default ControlWrapper;
