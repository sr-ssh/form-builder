import { memo } from "react";
import { ControlType } from "../../../@types/controls/ControlTypes";
import { shuffle } from "../../../utils/shuffle";
import { useFBRegisterControl } from "../../../hooks/useFBRegisterControl";
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";
import FormControlLabel from "@mui/material/FormControlLabel";
import { ArrangeTypeEnum } from "../../../@types/MultipleOptionTypes";
import { styled, useTheme } from "@mui/material";
import { useFBControl } from "../../../hooks/useFBControl";
import multiSelectStyle from "../../../utils/theme/multiSelectStyle";

const RadioStyle = styled(Radio)({
  paddingBlock: 0,
  ".MuiButtonBase-root": {},
  ".MuiSvgIcon-root": {
    width: "18px",
  },
});

type UniSelectPropsType = {
  control: ControlType;
};

const UniSelect = ({ control }: UniSelectPropsType) => {
  const { onChange, onBlur, name, defaultValue } =
    useFBRegisterControl(control);
  const { isDisabled } = useFBControl(control);
  const theme = useTheme();

  const info = control.multiple_option_info;

  const options = info?.randomize_option_number
    ? shuffle(info.options || [])
    : info?.options;

  return (
    <RadioGroup
      sx={{
        flexDirection:
          info?.arrange_type === ArrangeTypeEnum.Horizontal ? "row" : "column",
        ...multiSelectStyle(theme.controlsStyles),
        margin: 0,
      }}
      defaultValue={defaultValue || info?.default_selected_index}
      name={name}
      onChange={onChange}
      onBlur={onBlur}
    >
      {options?.map((option) => (
        <FormControlLabel
          key={option.value}
          value={option.value}
          disabled={isDisabled}
          control={<RadioStyle />}
          label={
            option.image_url ? (
              <img alt={option.text} src={option.image_url} width="200px" />
            ) : (
              option.text
            )
          }
        />
      ))}
    </RadioGroup>
  );
};

export default memo(UniSelect);
