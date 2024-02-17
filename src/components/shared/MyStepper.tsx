import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import { useFormPage } from "../../hooks/useFormPage";
import { getControl } from "../../utils/controlUtils";
import { ControlTypeEnum } from "../../@types/controls/ControlTypes";
import { PlaceHolderTypeEnum } from "../../@types/controls/PlaceHolderTypes";
import { PageIndexesType } from "../../@types/FormPageTypes";
import styled from "@emotion/styled";

const StepperStyle = styled(Stepper)({
  paddingInline: 16,
  ".MuiStep-root": {
    padding: 0,
  },
  ".MuiStepConnector-line": {
    borderColor: "#ECEBFF",
    borderTopWidth: 2,
    transform: "scaleX(1.3)",
    position: "relative",
    right: 1,
  },
  ".Mui-active, .Mui-completed": {
    ".MuiStepConnector-line": {
      borderColor: "#7367F0",
    },
  },
});

const StepLabelStyle = styled(StepLabel)({
  position: "relative",
  zIndex: 2,
  display: "flex",
  borderRadius: "50%",
  justifyContent: "center",
  alignItems: "center",
  fontFamily: "IRANSans",
  ".Mui-completed .MuiSvgIcon-root, .Mui-active .MuiSvgIcon-root ": {
    color: "#7367F0",
    backgroundColor: "#FAFAFA",
  },
  ".MuiSvgIcon-root": {
    color: "#ECEBFF",
    ".MuiStepIcon-text": {
      fill: "#7367F0",
    },
  },
  ".Mui-active": {
    backgroundColor: "#7367F0",
    color: "#FFF",
    paddingInline: 12,
    paddingBlock: 1,
    display: "flex",
    borderRadius: "42px",
  },
});

export default function MyStepper() {
  const [indexes, setIndexes] = React.useState<PageIndexesType>([0]);
  const [activeStep, setActiveStep] = React.useState<number>(0);
  let stepsRef = React.useRef<string[]>([]);

  const { form } = useFormPage({
    onIndexChanged: (nextIndexes: number[]) => {
      if (nextIndexes[0] >= 6) {
        setActiveStep(nextIndexes[0] - 6);
      } else {
        setActiveStep(nextIndexes[0] - 2);
      }
      setIndexes(nextIndexes);
    },
  });

  const control = getControl(form.controls, indexes);
  const isFinished = control?.control_id === "send";
  if (
    (control?.type === ControlTypeEnum.PlaceHolder &&
      control.place_holder_info?.type !== PlaceHolderTypeEnum.Note &&
      !isFinished) ||
    control?.control_id === "control_id_1"
  ) {
    return null;
  }

  if (isFinished || indexes[0] === 9 || indexes[0] === 10) return null;

  if (control?.control_id === "control_id_2") {
    stepsRef.current = ["گوارش", "کبد", "سینه", "گردن رحم"];
  }
  if (control?.control_id === "control_id_7") {
    stepsRef.current = ["گوارش", "کبد", "پروستات"];
  }

  return (
    <Box sx={{ width: "100%", marginBlockStart: 3, marginBlockEnd: 1 }}>
      <StepperStyle activeStep={activeStep}>
        {stepsRef.current.map((label, index) => {
          return (
            <Step key={label}>
              <StepLabelStyle
                {...(activeStep === index
                  ? { StepIconComponent: () => <div>{label}</div> }
                  : {})}
              ></StepLabelStyle>
            </Step>
          );
        })}
      </StepperStyle>
    </Box>
  );
}
