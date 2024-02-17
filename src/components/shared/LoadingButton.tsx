import { ReactNode, useState } from "react";
import {
  Button,
  CircularProgress,
  SxProps,
  Theme,
  styled,
} from "@mui/material";

const ButtonStyle = styled(Button)({
  height: 38,
});

const LoadingButton = ({
  sx,
  children,
  onClick,
}: {
  sx: SxProps<Theme>;
  children: ReactNode;
  onClick: () => Promise<any> | undefined;
}) => {
  const [loading, setLoading] = useState(false);

  const handleAsyncSubmit = async () => {
    setLoading(true);
    await onClick?.();
    setLoading(false);
  };

  return (
    <ButtonStyle
      onClick={handleAsyncSubmit}
      variant="outlined"
      disabled={loading}
      sx={sx}
    >
      {loading ? (
        <CircularProgress size={20} color="inherit" />
      ) : (
        <>{children}</>
      )}
    </ButtonStyle>
  );
};

export default LoadingButton;
