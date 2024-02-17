import { ControlStyleType } from "../../@types/ThemeTypes";

const multiSelectStyle = (groupStyle?: ControlStyleType) => {
  const border = groupStyle?.border;
  return {
    marginBlock: groupStyle?.margin?.horizontal + "px",
    marginInline: groupStyle?.margin?.vertical + "px",
    fontSize: groupStyle?.font_size + "px",
    fontWeight: groupStyle?.font_weight,
    color: groupStyle?.text_color,
    borderTop: border?.top,
    borderBottom: border?.bottom,
    borderRight: border?.right,
    borderLeft: border?.left,
    borderRadius: groupStyle?.radius + "px",
    boxShadow: groupStyle?.shadow,
  };
};

export default multiSelectStyle;
