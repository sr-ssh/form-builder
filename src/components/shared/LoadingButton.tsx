import { ReactNode, useState } from "react";
import { useClickAsync } from "../../core/hooks/useClickAsync";
import {
  Button,
  CircularProgress,
  SxProps,
  Theme,
  styled,
} from "@mui/material";

const ButtonStyle = styled(Button)({
  ".loading": {
    backgroundColor: "red",
  },
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
  };
  const clickRef = useClickAsync(handleAsyncSubmit, () => setLoading(false));
  console.log(loading);
  return (
    <ButtonStyle ref={clickRef} variant="outlined" disabled={loading} sx={sx}>
      {loading ? (
        <CircularProgress size={20} color="inherit" />
      ) : (
        <>{children}</>
      )}
    </ButtonStyle>
  );
};

export default LoadingButton;
