import Box from "@mui/material/Box";
import LinearProgressWithLabel from "./LinearProgressStyle";
import NextButton from "./NextButton";
import { getControl } from "../../../utils/controlUtils";
import { useFormPage } from "../../../hooks/useFormPage";
import { useState } from "react";
import { PageIndexesType } from "../../../@types/FormPageTypes";
import { ControlTypeEnum } from "../../../@types/controls/ControlTypes";
import { PlaceHolderTypeEnum } from "../../../@types/controls/PlaceHolderTypes";
import { hexToRgbA } from "../../../utils/hexToRgbA";
import { useTheme } from "@mui/material";

const Footer = () => {
  const theme = useTheme();
  const border = theme.controlsStyles?.border;
  const [indexes, setIndexes] = useState<PageIndexesType>([0]);
  const { submitForm, submitNext, form, gotoPrev } = useFormPage({
    onIndexChanged: (indexes: number[]) => {
      setIndexes(indexes);
    },
  });

  const control = getControl(form.controls, indexes);
  const isFinished = control?.control_id === "send";
  if (
    control?.type === ControlTypeEnum.PlaceHolder &&
    control.placeholder_info?.type !== PlaceHolderTypeEnum.Note &&
    !isFinished
  ) {
    return null;
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
      <LinearProgressWithLabel form={form} indexes={indexes} />
      <NextButton
        submitForm={submitForm}
        submitNext={submitNext}
        isFinished={isFinished}
        hasNext={form.has_next}
        hasPrev={form.has_prev}
        gotoPrev={gotoPrev}
      />
    </Box>
  );
};

export default Footer;
