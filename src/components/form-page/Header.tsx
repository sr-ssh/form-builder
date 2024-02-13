import Box from "@mui/material/Box";
import { getControl } from "../../utils/controlUtils";
import { useFormPage } from "../../hooks/useFormPage";
import { useState } from "react";
import { PageIndexesType } from "../../@types/FormPageTypes";
import { ControlTypeEnum } from "../../@types/controls/ControlTypes";
import { PlaceHolderTypeEnum } from "../../@types/controls/PlaceHolderTypes";
import { Typography, useTheme } from "@mui/material";
import styled from "@emotion/styled";
import { Localizer } from "../shared/Localizer";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const NoActiveMessage = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#fff",
  minHeight: "2.5rem",
  height: "51px",
  color: "#5D586C",
  userSelect: "none",
  boxShadow: "0px 4px 4px 0px #00000014",
  zIndex: 2,
  position: "relative",
});

const IconStyle = styled(Box)({
  position: "absolute",
  left: "10px",
});

const Header = () => {
  const [indexes, setIndexes] = useState<PageIndexesType>([0]);
  const { form, gotoPrev } = useFormPage({
    onIndexChanged: (indexes: number[]) => {
      setIndexes(indexes);
    },
  });

  const control = getControl(form.controls, indexes);
  const isFinished = control?.control_id === "send";
  if (
    control?.type === ControlTypeEnum.PlaceHolder &&
    control.place_holder_info?.type !== PlaceHolderTypeEnum.Note &&
    !isFinished
  ) {
    return null;
  }

  return (
    <NoActiveMessage>
      {!isFinished && (
        <>
          <IconStyle onClick={gotoPrev}>
            <ArrowForwardIcon />
          </IconStyle>
          <Typography fontSize={14}>
            {control?.control_id === "control_id_suggestions_men" ||
            control?.control_id === "control_id_suggestions_women" ? (
              <Localizer localeKey="HEADER_TITLE_2" />
            ) : (
              <Localizer localeKey="HEADER_TITLE_1" />
            )}
          </Typography>
        </>
      )}
    </NoActiveMessage>
  );
};

export default Header;
