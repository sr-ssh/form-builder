import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Localizer } from "../../shared/Localizer";
import LoadingButton from "../../shared/LoadingButton";

type NextButtonProps = {
  isFinished: boolean;
  submitForm: () => Promise<void> | undefined;
  submitNext: () => Promise<void> | undefined;
  gotoPrev: () => void;
  hasNext?: boolean;
  hasPrev?: boolean;
};

const NextButton = ({
  isFinished,
  submitForm,
  submitNext,
  hasNext,
  hasPrev,
  gotoPrev,
}: NextButtonProps) => (
  <Box>
    <Box display="flex" gap={1}>
      {hasPrev !== false && (
        <Button variant="outlined" onClick={() => gotoPrev()}>
          <ExpandLessIcon />
        </Button>
      )}
      {hasNext !== false && !isFinished && (
        <LoadingButton onClick={() => submitNext()}>
          <ExpandMoreIcon />
        </LoadingButton>
      )}
      <LoadingButton
        onClick={submitForm}
        sx={{ display: isFinished ? "auto" : "none" }}
      >
        <Localizer localeKey="FOOTER_SEND_BUTTON" />
      </LoadingButton>
    </Box>
  </Box>
);

export default NextButton;
