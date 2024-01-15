import { Theme } from "@mui/material";

const dateTimePickerStyle = ({
  controlsStyles,
  labelsStyle,
  answerColor,
  fontSize,
  fontName,
}: Theme) => {
  const border = controlsStyles?.border;
  return {
    ".MuiOutlinedInput-input": {
      fontSize: controlsStyles?.font_size || fontSize + "px",
      fontFamily: fontName,
      fontWeight: controlsStyles?.font_weight,
      zIndex: 1,
      color: controlsStyles?.text_color || answerColor,
    },
    ".MuiOutlinedInput-notchedOutline": {
      backgroundColor: controlsStyles?.background_color,
      borderTop: border?.top,
      borderBottom: border?.bottom,
      borderRight: border?.right,
      borderLeft: border?.left,
      borderRadius: controlsStyles?.radius + "px",
      boxShadow: controlsStyles?.shadow,
    },
    "& .MuiOutlinedInput-root": {
      "&.Mui-focused fieldset": {
        borderTop: border?.top,
        borderBottom: border?.bottom,
        borderRight: border?.right,
        borderLeft: border?.left,
        borderWidth: 2,
      },
    },
    "& .MuiInputLabel-root": {
      fontSize: labelsStyle?.font_size || fontSize + "px",
      fontWeight: labelsStyle?.font_weight,
      color: labelsStyle?.text_color,
      fontFamily: fontName,
      "&.Mui-focused": {
        color: labelsStyle?.text_color,
      },
    },
  };
};

export default dateTimePickerStyle;
