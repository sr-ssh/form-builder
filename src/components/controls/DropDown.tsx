import React from "react";
import { ControlType } from "../../@types/controls/ControlTypes";
import Autocomplete from "@mui/material/Autocomplete";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import { useFBRegisterControl } from "../../hooks/useFBRegisterControl";
import { useFBControl } from "../../hooks/useFBControl";

type DropDownPropsType = { control: ControlType; isFloatingBox?: boolean };

const DropDown = ({ control, isFloatingBox }: DropDownPropsType) => {
  const { onChange, onBlur, name, ref, defaultValue } =
    useFBRegisterControl(control);
  const { isDisabled } = useFBControl(control);

  const options = control.drop_down_info?.options;

  const selectedValues = React.useMemo(
    () => options?.filter((v) => v.value === defaultValue),
    [defaultValue, options],
  );

  return (
    <FormControl
      key={control.drop_down_info?.options?.toString()}
      disabled={isDisabled}
    >
      {control.drop_down_info?.searchable ? (
        <Autocomplete
          disabled={isDisabled}
          ref={ref}
          defaultValue={selectedValues?.[0]?.text}
          onChange={(event: any, value: any) => {
            onChange({
              target: {
                name: control.control_id,
                value: options?.find((item) => item.text === value)?.value,
              },
            });
          }}
          noOptionsText=""
          onBlur={onBlur}
          options={options?.map((option) => option?.text) || []}
          sx={{ minWidth: 100, display: "flex" }}
          renderInput={(params) => (
            <TextField
              {...params}
              label={isFloatingBox ? control.label_text : ""}
            />
          )}
        />
      ) : (
        <>
          {isFloatingBox && (
            <InputLabel id={control.control_id}>
              {control.label_text}
            </InputLabel>
          )}
          <Select
            labelId={control.control_id}
            ref={ref}
            onChange={onChange}
            onBlur={onBlur}
            name={name}
            sx={{ minWidth: 100 }}
            label={isFloatingBox ? control.label_text : ""}
            defaultValue={defaultValue || ""}
            MenuProps={{
              marginThreshold: 0,
            }}
          >
            {control.drop_down_info?.options?.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.text}
              </MenuItem>
            ))}
          </Select>
        </>
      )}
    </FormControl>
  );
};

export default DropDown;
