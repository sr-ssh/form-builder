import { ControlStyleType } from "../../@types/ThemeTypes";

const groupStyle = (groupStyle?: ControlStyleType) => {
  const border = groupStyle?.border;
  return {
    marginBlock: groupStyle?.margin?.horizontal + "px",
    marginInline: groupStyle?.margin?.vertical + "px",
    backgroundColor: groupStyle?.background_color,
    fontSize: groupStyle?.font_size + "px",
    fontWeight: groupStyle?.font_weight,
    color: groupStyle?.text_color,
    borderTop: border?.top,
    borderBottom: border?.bottom,
    borderRight: border?.right,
    borderLeft: border?.left,
    borderRadius: groupStyle?.radius + "px",
    boxShadow: groupStyle?.shadow,
    paddingInline: groupStyle?.padding?.horizontal + "px",
    paddingBlock: groupStyle?.padding?.vertical + "px",
  };
};

export default groupStyle;
