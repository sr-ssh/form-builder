export enum LayoutModesEnum {
  Layout1 = "Layout1",
  Layout2 = "Layout2",
  Layout3 = "Layout3",
}

export type LayoutType = {
  mode: LayoutModesEnum;
  has_logo?: boolean;
  floating_box?: boolean;
};
