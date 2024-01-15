import { createTheme } from "@mui/material/styles";
import {
  ControlStyleType,
  MarginSizeType,
  ThemeBackgroundType,
  ThemeType,
} from "../../@types/ThemeTypes";
import textFieldStyleOverride from "./textFieldStyle";
import inputLabelStyle from "./inputLabelStyle";
import selectStyleOverride from "./selectStyle";
import buttonStyleOverride from "./buttonStyle";
import descriptionStyle from "./descriptionStyle";
import progressStyleOverride from "./progressStyle";
import autoCompleteListStyle from "./autoCompleteListStyle";
import selectListStyleOverride from "./selectListStyle";
import { LocaleEnum } from "../../@types/FormTypes";

declare module "@mui/material/styles" {
  interface Theme {
    background: ThemeBackgroundType;
    padding: MarginSizeType;
    controlsStyles: ControlStyleType;
    fontName: string;
    fontSize: number;
    groupsStyle: ControlStyleType;
    placeHoldersStyle: ControlStyleType;
    labelsStyle: ControlStyleType;
    answerColor: string;
  }
  interface ThemeOptions {
    background?: ThemeBackgroundType;
    padding?: MarginSizeType;
    controlsStyles?: ControlStyleType;
    fontName?: string;
    fontSize?: number;
    groupsStyle?: ControlStyleType;
    placeHoldersStyle?: ControlStyleType;
    labelsStyle?: ControlStyleType;
    answerColor?: string;
  }
}

const theme = ({
  formTheme,
  locale,
}: {
  formTheme: ThemeType;
  locale?: LocaleEnum;
}) =>
  createTheme({
    direction: locale === LocaleEnum.English ? "ltr" : "rtl",
    components: {
      MuiTextField: textFieldStyleOverride(formTheme),
      MuiInputLabel: inputLabelStyle(formTheme),
      MuiSelect: selectStyleOverride(formTheme),
      MuiButton: buttonStyleOverride(formTheme),
      MuiLinearProgress: progressStyleOverride(formTheme),
      MuiAutocomplete: autoCompleteListStyle(formTheme),
      MuiList: selectListStyleOverride(formTheme),
    },
    typography: {
      fontSize: formTheme.font_size,
      ...(locale !== LocaleEnum.English && { fontFamily: formTheme.font_name }),
      subtitle2: descriptionStyle(formTheme),
      body2: descriptionStyle(formTheme),
    },
    background: formTheme.background,
    padding: formTheme.padding,
    controlsStyles: formTheme.controls_style,
    fontName: formTheme.font_name,
    fontSize: formTheme.font_size,
    groupsStyle: formTheme.groups_style,
    placeHoldersStyle: formTheme.placeholders_style,
    labelsStyle: formTheme.labels_style,
    answerColor: formTheme.answer_color,
  });

export default theme;
