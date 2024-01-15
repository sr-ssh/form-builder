import {
  ControlType,
  ControlTypeEnum,
} from "../../../@types/controls/ControlTypes";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

type DescriptionPropsType = {
  control: ControlType;
  isFloatingBox?: boolean;
};

const Description = ({ control, isFloatingBox }: DescriptionPropsType) => {
  const isFloatingDropDown =
    control.type === ControlTypeEnum.DropDown && isFloatingBox;

  return (
    <>
      {control.description && (
        <Box marginBlock={isFloatingDropDown ? 0 : 2}>
          <Typography variant="body2">{control.description}</Typography>
        </Box>
      )}
    </>
  );
};

export default Description;
