import { ReactNode, useState } from "react";
import { Button, CircularProgress, SxProps, Theme } from "@mui/material";

const LoadingButton = ({
  sx,
  children,
  onClick,
}: {
  sx?: SxProps<Theme>;
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
    <Button
      variant="outlined"
      disabled={loading}
      sx={sx}
      onClick={handleAsyncSubmit}
    >
      {loading ? (
        <CircularProgress size={20} color="inherit" />
      ) : (
        <>{children}</>
      )}
    </Button>
  );
};

export default LoadingButton;
