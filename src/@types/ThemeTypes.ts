export type MarginSizeType = { horizontal: number; vertical: number };

export type BorderStyleType = {
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
};

export enum ImageAlignEnum {
  Left = "Left",
  Right = "Right",
  Center = "Center",
  Fit = "Fit",
  Repeat = "Repeat",
}

export type ThemeBackgroundType = {
  color?: string;
  image_url?: string;
  image_align?: ImageAlignEnum;
  image_opacity?: number;
};

export type ControlStyleType = {
  border?: BorderStyleType;
  shadow?: string;
  padding?: MarginSizeType;
  margin?: MarginSizeType;
  background_color?: string;
  radius?: number;
  font_size?: number;
  font_weight?: string;
  text_color?: string;
};

export type ThemeType = {
  theme_id: string;
  name?: string;
  is_default?: boolean;
  padding?: MarginSizeType;
  background?: ThemeBackgroundType;
  font_name?: string;
  font_size?: number;
  question_color?: string;
  answer_color?: string;
  labels_style?: ControlStyleType;
  buttons_style?: ControlStyleType;
  controls_style?: ControlStyleType;
  groups_style?: ControlStyleType;
  placeholders_style?: ControlStyleType;
};
