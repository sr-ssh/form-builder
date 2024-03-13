import styled from "@emotion/styled";
import { Box, Typography, useTheme } from "@mui/material";
import { hexToRgbA } from "../../utils/hexToRgbA";

const LogoStyle = styled.img({
  left: 6,
  // padding: 5,
});

const Logo = ({ logo, name }: { logo?: string; name?: string }) => {
  const theme = useTheme();
  const border = theme.controlsStyles?.border;

  return (
    <Box
      display="flex"
      alignItems="center"
      px={"10px"}
      gap={2}
      paddingBlockEnd={2}
      paddingBlockStart={"6px"}
      borderBottom={border?.top}
      sx={{
        backgroundColor: hexToRgbA(theme?.background?.color, 0.5),
        position: "relative",
        zIndex: 2,
      }}
    >
      <LogoStyle alt="logo" src={logo} width={60} />
      <Typography>{name}</Typography>
    </Box>
  );
};

export default Logo;
