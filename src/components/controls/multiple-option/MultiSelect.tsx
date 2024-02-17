import { Fragment, memo } from "react";
import { ControlType } from "../../../@types/controls/ControlTypes";
import { shuffle } from "../../../utils/shuffle";
import { useFBRegisterControl } from "../../../hooks/useFBRegisterControl";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

import {
  ArrangeTypeEnum,
  MultipleOptionTypeEnum,
} from "../../../@types/MultipleOptionTypes";
import { useTheme } from "@mui/material";
import { useFBControl } from "../../../hooks/useFBControl";
import multiSelectStyle from "../../../utils/theme/multiSelectStyle";

type MultiSelectPropsType = {
  control: ControlType;
};

const MultiSelect = ({ control }: MultiSelectPropsType) => {
  const { onChange, onBlur, name, ref, defaultValue } =
    useFBRegisterControl(control);
  const { isDisabled } = useFBControl(control);
  const theme = useTheme();

  const info = control.multiple_option_info;
  if (!info) {
    return <></>;
  }
  const options = info?.randomize_option_number
    ? shuffle(info.options || [])
    : info?.options;

  return (
    <FormGroup
      sx={{
        flexDirection:
          info.arrange_type === ArrangeTypeEnum.Horizontal ? "row" : "column",
        ...multiSelectStyle(theme.controlsStyles),
      }}
    >
      {options?.map((option) => (
        <Fragment key={option.value}>
          {info.type === MultipleOptionTypeEnum.Image ? (
            <FormControlLabel
              disabled={isDisabled}
              control={
                <Checkbox
                  inputRef={ref}
                  onChange={onChange}
                  onBlur={onBlur}
                  name={name}
                  value={option.value}
                  defaultChecked={defaultValue === option.value}
                />
              }
              label={
                <img alt={option.text} src={option.image_url} width="200px" />
              }
            />
          ) : (
            <FormControlLabel
              disabled={isDisabled}
              control={
                <Checkbox
                  inputRef={ref}
                  onChange={onChange}
                  onBlur={onBlur}
                  name={name}
                  value={option.value}
                  defaultChecked={defaultValue === option.value}
                />
              }
              label={option.text}
            />
          )}
        </Fragment>
      ))}
    </FormGroup>
  );
};

export default memo(MultiSelect);
