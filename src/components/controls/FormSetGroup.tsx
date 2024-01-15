import ControlWrapper from "../form-page/control-wrapper/ControlWrapper";
import ControlSelector from "../form-page/ControlSelector";
import { ControlType } from "../../@types/controls/ControlTypes";
import { useCallback, useContext, useEffect, useState } from "react";
import { FBContext } from "../../context/FBContextProvider";
import Box from "@mui/material/Box";
import groupStyle from "../../utils/theme/groupStyle";
import { styled, useTheme } from "@mui/material";

const ContainerStyle = styled(Box)({
  display: "flex",
  flexDirection: "column",
  gap: "24px",
});

type GroupPropsType = {
  controls: ControlType[];
  control: ControlType;
  isFloatingBox?: boolean;
  hideQuestionNumber?: boolean;
};

const FormSetGroup = ({
  controls: _controls,
  control,
  isFloatingBox,
  hideQuestionNumber,
}: GroupPropsType) => {
  const [controls, setControls] = useState<ControlType[]>(_controls);

  const theme = useTheme();
  const { registerFormSet } = useContext(FBContext);

  const listenControlChanges = useCallback((newControls: ControlType[]) => {
    setControls([...newControls]);
  }, []);

  useEffect(() => {
    registerFormSet(listenControlChanges, control.control_id);
    // TODO: take the setState out of the useEffect
    // setControls(
    //   hideControlsWithConditionOn(control.group_info?.controls || []),
    // );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ContainerStyle sx={{ ...groupStyle(theme.groupsStyle) }}>
      {controls
        ?.filter((x) => !x.is_hidden)
        .map((controlItem: ControlType) => (
          <ControlWrapper
            key={controlItem.control_id}
            control={controlItem}
            isFloatingBox={isFloatingBox}
            hideQuestionNumber={hideQuestionNumber}
          >
            <ControlSelector
              control={controlItem}
              isFloatingBox={isFloatingBox}
            />
          </ControlWrapper>
        ))}
    </ContainerStyle>
  );
};

export default FormSetGroup;
