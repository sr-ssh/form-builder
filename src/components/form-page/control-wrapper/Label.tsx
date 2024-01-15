import { useMemo } from "react";
import {
  ControlType,
  ControlTypeEnum,
} from "../../../@types/controls/ControlTypes";
import InputLabel from "@mui/material/InputLabel";
import Box from "@mui/material/Box";
import { ValidationTypeEnum } from "../../../@types/ValidationTypes";
import { styled } from "@mui/material";

const QuestionNumberLabel = styled(InputLabel)({
  position: "static",
  maxWidth: "unset",
  display: "inline-block",
  transform: "none",
  paddingInlineEnd: "0.25rem",
});

const LabelText = styled(InputLabel)({
  position: "static",
  display: "inline-block",
  maxWidth: "unset",
  transform: "none",
});

const Required = styled("span")(({ theme }) => ({
  color: theme.palette.error.main,
}));

type LabelPropsType = {
  control: ControlType;
  isFloatingBox?: boolean;
  hideQuestionNumber?: boolean;
  getQuestionNumber: () => string | undefined;
};

const Label = ({
  control,
  getQuestionNumber,
  isFloatingBox,
  hideQuestionNumber,
}: LabelPropsType) => {
  const id = control?.control_id;
  const label = control?.label_text;

  const isFloatingDropDown =
    control.type === ControlTypeEnum.DropDown && isFloatingBox;

  const questionNumber = useMemo(
    () => getQuestionNumber(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [control],
  );

  let hasQuestionNumber: boolean = !!(!hideQuestionNumber && questionNumber);

  const isRequired = control.validations?.find(
    (item) => item.type === ValidationTypeEnum.Required,
  );

  return (
    <Box display="flex" alignItems="center">
      {hasQuestionNumber ? (
        <QuestionNumberLabel shrink>{questionNumber}- </QuestionNumberLabel>
      ) : null}
      <LabelText
        shrink={isFloatingDropDown ? undefined : true}
        htmlFor={id}
        id={id}
      >
        {label}
        {isRequired ? <Required>*</Required> : null}
      </LabelText>
    </Box>
  );
};

export default Label;
