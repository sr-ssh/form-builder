import { Box, CircularProgress, styled } from "@mui/material";
import { Localizer } from "./Localizer";

const BoxStyle = styled(Box)({
  backgroundColor: "#ECEBFF",
  color: "#7367F0",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  fontFamily: "IRANSans",
  height: 40,
  borderRadius: 6,
  paddingInline: 8,
  marginBlock: 10,
});

const ShowNum = ({ num, label }: { num: string; label: string }) => {
  return (
    <BoxStyle>
      <Localizer localeKey={label} />
      {num !== "NaN" ? (
        <Box fontSize={20} fontWeight={500}>
          {num}
        </Box>
      ) : (
        <CircularProgress size={25} color="inherit" />
      )}
    </BoxStyle>
  );
};

export default ShowNum;
