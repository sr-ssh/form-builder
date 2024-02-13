import { Theme } from "@mui/material/styles";
import { PlaceHolderTypeEnum } from "../../@types/controls/PlaceHolderTypes";

const placeHolderStyle = (
  { placeHoldersStyle, fontSize, fontName }: Theme,
  type?: PlaceHolderTypeEnum,
) => {
  const border = placeHoldersStyle?.border;
  const isNote = type === PlaceHolderTypeEnum.Note;
  return {
    marginBlock: isNote ? 0 : placeHoldersStyle?.margin?.horizontal + "px",
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
    borderRadius: isNote ? "6px" : placeHoldersStyle?.radius + "px",
    boxShadow: placeHoldersStyle?.shadow,
    paddingInline: isNote
      ? "16px"
      : placeHoldersStyle?.padding?.horizontal + "px",
    paddingBlock: isNote ? "16px" : placeHoldersStyle?.padding?.vertical + "px",
  };
};

export default placeHolderStyle;
