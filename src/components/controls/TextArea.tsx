import { ChangeEvent, useRef } from "react";
import { ControlType } from "../../@types/controls/ControlTypes";
import { useFBControl } from "../../hooks/useFBControl";
import { useFBRegisterControl } from "../../hooks/useFBRegisterControl";
import TextField from "@mui/material/TextField";

type TextAreaPropsType = {
  control: ControlType;
  isFloatingBox?: boolean;
};

const TextArea = ({ control, isFloatingBox }: TextAreaPropsType) => {
  const textAreaRef = useRef<HTMLTextAreaElement>();
  const { onChange, onBlur, name, ref } = useFBRegisterControl(control);
  const { isDisabled } = useFBControl(control);

  const maxLine = control.textarea_info?.max_line;

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (maxLine && textAreaRef.current) {
      let text = textAreaRef.current.value;
      const lines = text?.split("\n");

      if (lines.length > maxLine) {
        const truncatedText = lines.slice(0, maxLine).join("\n");
        textAreaRef.current.value = truncatedText;
      } else {
        onChange(e);
      }
    }
  };

  return (
    <TextField
      InputLabelProps={{
        sx: { marginTop: "3px" },
      }}
      ref={ref}
      inputRef={(r) => (textAreaRef.current = r)}
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
