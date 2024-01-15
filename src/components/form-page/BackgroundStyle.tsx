import Container from "@mui/material/Container";
import { getBackgroundPosition } from "../../utils/styleUtils";
import { styled, useTheme } from "@mui/material";

const BackgroundStyle = styled(Container)(() => {
  const formTheme = useTheme();
  const backgroundStyles = formTheme.background;
  const imageAlign = backgroundStyles?.image_align;
  return {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    padding: "0 !important",
    maxWidth: "100% !important",
    ".partial-tab-container": {
      backgroundColor: backgroundStyles?.color || "#fff",
      backgroundImage: `url("${backgroundStyles?.image_url}")`,
      opacity: backgroundStyles?.image_opacity,
      ...(imageAlign && getBackgroundPosition(imageAlign)),
    },
    ".view-wrapper": {
      overflowY: "scroll",
      paddingInline: formTheme?.padding?.horizontal + "px",
      paddingBlock: formTheme?.padding?.vertical + "px",
    },
  };
});

export default BackgroundStyle;
