import Box from "@mui/material/Box";
import LinearProgressWithLabel from "./LinearProgressStyle";
import NextButton from "./NextButton";
import { getControl } from "../../../utils/controlUtils";
import { useFormPage } from "../../../hooks/useFormPage";
import { useRef, useState } from "react";
import { PageIndexesType } from "../../../@types/FormPageTypes";
import { ControlTypeEnum } from "../../../@types/controls/ControlTypes";
import { PlaceHolderTypeEnum } from "../../../@types/controls/PlaceHolderTypes";
import { hexToRgbA } from "../../../utils/hexToRgbA";
import { Button, useTheme } from "@mui/material";
import LoadingButton from "../../shared/LoadingButton";
import { Localizer } from "../../shared/Localizer";

const Footer = () => {
  const theme = useTheme();
  const labelRef = useRef("");
  const border = theme.controlsStyles?.border;
  const [indexes, setIndexes] = useState<PageIndexesType>([0]);
  const { submitForm, submitNext, form } = useFormPage({
    onIndexChanged: (indexes: number[]) => {
      setIndexes(indexes);
    },
  });

  const control = getControl(form.controls, indexes);
  const isFinished = control?.control_id === "send";
  if (
    control?.type === ControlTypeEnum.PlaceHolder &&
    control.place_holder_info?.type !== PlaceHolderTypeEnum.Note &&
    !isFinished
  ) {
    return null;
  }
  switch (indexes[0]) {
    case 1:
      labelRef.current = "PLACEHOLDER_START_BUTTON";
      break;
    case 2:
    case 4:
    case 6:
    case 7:
      labelRef.current = "FOOTER_BUTTON_LABEL_NEXT";
      break;
    case 5:
    case 8:
      labelRef.current = "FOOTER_BUTTON_LABEL_RESULT";
      break;
    case 9:
    case 10:
      labelRef.current = "FOOTER_SEND_BUTTON";
      break;
    default:
      // labelRef.current = "FOOTER_SEND_BUTTON";
      break;
  }

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      height="60px"
      px={2}
      borderTop={border?.top}
      sx={{ backgroundColor: hexToRgbA(theme?.background?.color, 0.5) }}
    >
      <LoadingButton
        onClick={isFinished ? submitForm : submitNext}
        sx={{ width: "100%" }}
      >
        <Localizer localeKey={labelRef.current} />
      </LoadingButton>
    </Box>
  );
};

export default Footer;
