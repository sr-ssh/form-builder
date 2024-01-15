import { ThemeType } from "../../@types/ThemeTypes";

const progressStyleOverride = ({ labels_style }: ThemeType) => ({
  styleOverrides: {
    root: { backgroundColor: labels_style?.text_color + "30" },
    bar: {
      backgroundColor: labels_style?.text_color,
    },
  },
});

export default progressStyleOverride;
