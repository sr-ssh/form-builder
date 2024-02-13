import { useMemo } from "react";
import {
  ControlType,
  ControlTypeEnum,
} from "../../../@types/controls/ControlTypes";
import InputLabel from "@mui/material/InputLabel";
import Box from "@mui/material/Box";
import { ValidationTypeEnum } from "../../../@types/ValidationTypes";
import { Chip, styled } from "@mui/material";
import { PlaceHolderTypeEnum } from "../../../@types/controls/PlaceHolderTypes";

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
  whiteSpace: "normal",
  overflow: "normal",
  textOverflow: "none",
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

  let chipLabel, chipColor, chipBg;
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
    chipLabel = "پرخطر";
    chipColor = "#E72828";
    chipBg = "#FFE0E0";
  } else if (
    control.control_id === "control_id_suggestions_men_2" ||
    control.control_id === "control_id_suggestions_men_5" ||
    control.control_id === "control_id_suggestions_women_2" ||
    control.control_id === "control_id_suggestions_women_5" ||
    control.control_id === "control_id_suggestions_women_7"
  ) {
    chipLabel = "خطر متوسط";
    chipColor = "#FF971C";
    chipBg = "#FFEFDC";
  } else {
    chipLabel = "وضعیت سالم";
    chipColor = "#00BD62";
    chipBg = "#E0FFEA";
  }

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
      {control.place_holder_info?.type === PlaceHolderTypeEnum.Note && (
        <Chip
          label={chipLabel}
          sx={{
            backgroundColor: chipBg,
            color: chipColor,
            marginInlineStart: 2,
          }}
        />
      )}
    </Box>
  );
};

export default Label;
