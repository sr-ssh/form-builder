import { ChangeEvent } from "react";
import { ControlType } from "../../@types/controls/ControlTypes";
import { useFBControl } from "../../hooks/useFBControl";
import { useFBRegisterControl } from "../../hooks/useFBRegisterControl";
import TextField from "@mui/material/TextField";

type TextAreaPropsType = {
  control: ControlType;
  isFloatingBox?: boolean;
};

const TextArea = ({ control, isFloatingBox }: TextAreaPropsType) => {
  const { onChange, onBlur, name, ref } = useFBRegisterControl(control);
  const { isDisabled } = useFBControl(control);

  const maxLine = control.textarea_info?.max_line;

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    if (maxLine) {
      const text = event.target.value;
      const newLines = (text.match(/\n/g) || []).length;

      console.log(newLines);
      if (newLines <= maxLine - 1) {
        // Add the text if the number of new lines is within the limit
        // setFormFields(text);
        onChange(event);
      } else {
        // Don't add any more text if the limit is exceeded
        console.log("maxline");
        event.preventDefault();
      }
    }
  };

  const handleMaxLine = (ref: HTMLDivElement) => {
    if (maxLine) {
      let text = ref.innerText;
      const newline = "\n";
      let count = 0;
      let index = -1;

      for (let i = 0; i < text.length; i++) {
        if (text.charAt(i) === newline) {
          count++;
          if (count === 4) {
            index = i;
            break;
          }
        }
      }

      if (index !== -1) {
        ref.innerText.substring(0, index + 1);
      }
    }
  };

  return (
    <TextField
      InputLabelProps={{
        sx: { marginTop: "3px" },
      }}
      ref={(r) => {
        if (r) {
          handleMaxLine(r);
        }
        ref(r);
      }}
      name={name}
      onChange={handleChange}
      onBlur={onBlur}
      multiline={true}
      rows={control.textarea_info?.line_count}
      label={isFloatingBox ? control.label_text : ""}
      disabled={isDisabled}
    />
  );
};
export default TextArea;
