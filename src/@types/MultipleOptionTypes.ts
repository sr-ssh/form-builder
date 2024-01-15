type ImageOptionType = { text?: string; value?: string; image_url?: string };

export type TextOptionType = { text?: string; value?: string };

export enum MultipleOptionTypeEnum {
  Text = "Text",
  Image = "Image",
}

export enum ArrangeTypeEnum {
  Horizontal = "Horizontal",
  Vertical = "Vertical",
}

export type MultipleOptionType = {
  type?: MultipleOptionTypeEnum;
  multi_select?: boolean;
  options?: TextOptionType[] | ImageOptionType[];
  randomize_option_number?: boolean;
  arrange_type?: ArrangeTypeEnum;
  default_selected_index?: number;
};
