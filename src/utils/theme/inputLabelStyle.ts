import { ThemeType } from "../../@types/ThemeTypes";

const inputLabelStyle = ({
  labels_style,
  font_size,
  font_name,
}: ThemeType) => ({
  styleOverrides: {
    root: {
      fontSize: labels_style?.font_size || font_size + "px",
      fontWeight: labels_style?.font_weight,
      color: labels_style?.text_color,
      fontFamily: font_name,
      left: "-2px",
      "&.Mui-focused": {
        color: labels_style?.text_color,
      },
    },
  },
});
export default inputLabelStyle;
