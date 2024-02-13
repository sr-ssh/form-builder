import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useFormPage } from "../../hooks/useFormPage";
import { getControl } from "../../utils/controlUtils";
import { ControlTypeEnum } from "../../@types/controls/ControlTypes";
import { PlaceHolderTypeEnum } from "../../@types/controls/PlaceHolderTypes";
import { PageIndexesType } from "../../@types/FormPageTypes";
import styled from "@emotion/styled";

const StepLabelStyle = styled(StepLabel)({
  zIndex: 1,
  display: "flex",
  borderRadius: "50%",
  justifyContent: "center",
  alignItems: "center",
  ".Mui-completed .MuiSvgIcon-root, .Mui-active .MuiSvgIcon-root ": {
    color: "#7367F0",
  },
  ".Mui-active": {
    backgroundColor: "#7367F0",
    color: "#FFF",
    paddingInline: 9,
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
      if (nextIndexes[0] >= 7) {
        setActiveStep(nextIndexes[0] - 7);
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

  if (control?.control_id === "control_id_2") {
    stepsRef.current = ["گوارش", "کبد", "سینه", "گردن رحم", "ریه"];
  }
  if (control?.control_id === "control_id_7") {
    stepsRef.current = ["گوارش", "کبد", "پروستات", "ریه"];
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Stepper activeStep={activeStep}>
        {stepsRef.current.map((label, index) => {
          return (
            <Step key={label}>
              <StepLabelStyle
                {...(activeStep === index
                  ? { StepIconComponent: () => <div>{label}</div> }
                  : {})}
                // icon={index === activeStep ? label : index + 1}
              ></StepLabelStyle>
            </Step>
          );
        })}
      </Stepper>
    </Box>
  );
}
