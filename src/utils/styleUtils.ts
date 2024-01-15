import { ImageAlignEnum } from "../@types/ThemeTypes";

export const getBackgroundPosition = (imageAlign: ImageAlignEnum) => {
  switch (imageAlign) {
    case ImageAlignEnum.Left:
      return { backgroundPosition: "left" };
    case ImageAlignEnum.Center:
      return { backgroundPosition: "center" };
    case ImageAlignEnum.Right:
      return { backgroundPosition: "right" };
    case ImageAlignEnum.Repeat:
      return { backgroundRepeat: "repeat" };
    case ImageAlignEnum.Fit:
      return { backgroundPosition: "cover" };
    default:
      return {};
  }
};
