import { Theme } from "@mui/material/styles";

const placeHolderStyle = ({ placeHoldersStyle, fontSize, fontName }: Theme) => {
  const border = placeHoldersStyle?.border;
  return {
    marginBlock: placeHoldersStyle?.margin?.horizontal + "px",
    marginInline: placeHoldersStyle?.margin?.vertical + "px",
    backgroundColor: placeHoldersStyle?.background_color,
    fontSize: placeHoldersStyle?.font_size || fontSize + "px",
    fontFamily: fontName,
    fontWeight: placeHoldersStyle?.font_weight,
    color: placeHoldersStyle?.text_color,
    borderTop: border?.top,
    borderBottom: border?.bottom,
    borderRight: border?.right,
    borderLeft: border?.left,
    borderRadius: placeHoldersStyle?.radius + "px",
    boxShadow: placeHoldersStyle?.shadow,
    paddingInline: placeHoldersStyle?.padding?.horizontal + "px",
    paddingBlock: placeHoldersStyle?.padding?.vertical + "px",
  };
};

export default placeHolderStyle;
