import { ThemeType } from "../../@types/ThemeTypes";

const selectListStyleOverride = ({
  controls_style,
  answer_color,
}: ThemeType) => ({
  styleOverrides: {
    root: {
      backgroundColor: controls_style?.background_color,
      color: controls_style?.text_color || answer_color,
    },
  },
});

export default selectListStyleOverride;
