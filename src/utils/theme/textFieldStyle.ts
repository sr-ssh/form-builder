import { ThemeType } from "../../@types/ThemeTypes";

const textFieldStyleOverride = ({
  controls_style,
  answer_color,
  font_size,
  font_name,
}: ThemeType) => {
  const border = controls_style?.border;
  return {
    styleOverrides: {
      root: {
        "input:-webkit-autofill": {
          transition: "background-color 5000s ease-in-out 0s",
          WebkitTextFillColor: `${
            controls_style?.text_color || answer_color
          } !important`,
          WebkitBoxShadow: `0 0 0px 1000px ${controls_style?.background_color} inset`,
          borderRadius: controls_style?.radius + "px",
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
        "& input:valid:focus + fieldset": {
          borderTop: border?.top,
          borderBottom: border?.bottom,
          borderRight: border?.right,
          borderLeft: border?.left,
          borderWidth: 2,
        },
        ".MuiOutlinedInput-input": {
          fontSize: controls_style?.font_size || font_size + "px",
          fontWeight: controls_style?.font_weight,
          fontFamily: font_name,
          color: controls_style?.text_color || answer_color,
          zIndex: 1,
          // for webkit autofill
          margin: 2,
          padding: "14.5px 12px",
        },
        ".MuiOutlinedInput-notchedOutline": {
          backgroundColor: controls_style?.background_color,
          borderTop: border?.top,
          borderBottom: border?.bottom,
          borderRight: border?.right,
          borderLeft: border?.left,
          borderRadius: controls_style?.radius + "px",
          boxShadow: controls_style?.shadow,
        },
        ".MuiOutlinedInput-root:hover:not(.Mui-focused) .MuiOutlinedInput-notchedOutline ":
          {
            borderTop: border?.top,
            borderBottom: border?.bottom,
            borderRight: border?.right,
            borderLeft: border?.left,
            borderWidth: "2px",
          },
        ".Mui-disabled.MuiOutlinedInput-root:hover:not(.Mui-focused) .MuiOutlinedInput-notchedOutline":
          {
            borderColor: "inherit",
            borderWidth: "1px",
          },
      },
    },
  };
};

export default textFieldStyleOverride;
