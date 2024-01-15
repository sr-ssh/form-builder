import { Theme } from "@mui/material";

const fileUploadStyle = ({
  controlsStyles,
  fontName,
  fontSize,
  answerColor,
}: Theme) => ({
  fontSize: controlsStyles?.font_size || fontSize + "px",
  fontWeight: controlsStyles?.font_weight,
  fontFamily: fontName,
  color: controlsStyles?.text_color || answerColor,
  backgroundColor: controlsStyles?.background_color,
  borderTop: controlsStyles?.border?.top,
  borderBottom: controlsStyles?.border?.bottom,
  borderRight: controlsStyles?.border?.right,
  borderLeft: controlsStyles?.border?.left,
  borderRadius: controlsStyles?.radius + "px",
  boxShadow: controlsStyles?.shadow,
  paddingInline: controlsStyles?.padding?.horizontal + "px",
  paddingBlock: controlsStyles?.padding?.vertical + "px",
});

export default fileUploadStyle;
