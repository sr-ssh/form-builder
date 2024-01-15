import { ThemeType } from "../../@types/ThemeTypes";

const descriptionStyle = ({ labels_style }: ThemeType) => ({
  color: labels_style?.text_color + "90",
});
export default descriptionStyle;
