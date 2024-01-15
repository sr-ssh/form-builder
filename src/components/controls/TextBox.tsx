import { TextBoxTypeEnum } from "../../@types/controls/TextBoxTypes";
import { useFBRegisterControl } from "../../hooks/useFBRegisterControl";
import { ControlType } from "../../@types/controls/ControlTypes";
import TextField from "@mui/material/TextField";
import { useFBControl } from "../../hooks/useFBControl";

const TextBox = ({
  control,
  isFloatingBox,
}: {
  control: ControlType;
  isFloatingBox?: boolean;
}) => {
  const { onChange, onBlur, name, ref } = useFBRegisterControl(control);
  const { getControlErrors, isDisabled } = useFBControl(control);

  let inputType = "text";

  switch (control?.textbox_info?.type) {
    case TextBoxTypeEnum.Email:
      inputType = "email";
      break;
    case TextBoxTypeEnum.Mobile:
      inputType = "tel";
      break;
    case TextBoxTypeEnum.Number:
      inputType = "number";
      break;
    case TextBoxTypeEnum.Text:
      inputType = "text";
      break;
    case TextBoxTypeEnum.Url:
      inputType = "url";
      break;
    case TextBoxTypeEnum.NationalId:
      inputType = "tel";
      break;
    case TextBoxTypeEnum.PostalCode:
      inputType = "tel";
      break;
    default:
      break;
  }

  return (
    <TextField
      error={!!getControlErrors()?.type}
      ref={ref}
      onChange={onChange}
      onBlur={onBlur}
      name={name}
      type={inputType}
      label={isFloatingBox ? control.label_text : ""}
      disabled={isDisabled}
    />
  );
};

export default TextBox;
