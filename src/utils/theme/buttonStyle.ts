import { ThemeType } from "../../@types/ThemeTypes";

const buttonStyleOverride = ({
  buttons_style,
  font_size,
  font_name,
}: ThemeType) => {
  const border = buttons_style?.border;
  const styles = {
    marginBlock: buttons_style?.margin?.horizontal + "px",
    marginInline: buttons_style?.margin?.vertical + "px",
    backgroundColor: buttons_style?.background_color,
    fontSize: buttons_style?.font_size || font_size + "px",
    fontWeight: buttons_style?.font_weight,
    fontFamily: font_name,
    color: buttons_style?.text_color,
    borderTop: border?.top,
    borderBottom: border?.bottom,
    borderRight: border?.right,
    borderLeft: border?.left,
    borderRadius: buttons_style?.radius + "px",
    boxShadow: buttons_style?.shadow,
    paddingInline: buttons_style?.padding?.horizontal + "px",
    paddingBlock: buttons_style?.padding?.vertical + "px",
  };
  return {
    styleOverrides: {
      root: { ...styles, ":hover": styles, focusVisible: styles },
    },
  };
};

export default buttonStyleOverride;
