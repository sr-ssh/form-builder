import { ReactNode, useState } from "react";
import { useClickAsync } from "../../core/hooks/useClickAsync";
import { Button, CircularProgress, SxProps, Theme } from "@mui/material";

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
  const clickRef = useClickAsync(handleAsyncSubmit, () => setLoading(true));

  return (
    <Button ref={clickRef} variant="outlined" disabled={loading} sx={sx}>
      {loading ? (
        <CircularProgress size={20} color="inherit" />
      ) : (
        <>{children}</>
      )}
    </Button>
  );
};

export default LoadingButton;
