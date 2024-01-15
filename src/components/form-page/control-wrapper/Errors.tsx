import FormHelperText from "@mui/material/FormHelperText";
import { FieldError, FieldErrorsImpl, Merge } from "react-hook-form";

type ErrorsPropsType = {
  getControlErrors: () =>
    | FieldError
    | Merge<FieldError, FieldErrorsImpl<any>>
    | undefined;
};

const Errors = ({ getControlErrors }: ErrorsPropsType) => {
  const hasError = !!getControlErrors()?.type;

  return (
    <>
      {hasError && (
        <FormHelperText
          sx={{
            margin: 0,
          }}
        >
          {getControlErrors()?.message?.toString()}
        </FormHelperText>
      )}
    </>
  );
};

export default Errors;
