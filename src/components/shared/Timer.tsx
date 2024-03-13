import { Box, Typography } from "@mui/material";
import useCountdown from "../../hooks/useCountDown";
import { useFormPage } from "../../hooks/useFormPage";
import { Localizer } from "./Localizer";
import styled from "@emotion/styled";
import { useEffect, useState } from "react";
import { PageIndexesType } from "../../@types/FormPageTypes";
import { getControl } from "../../utils/controlUtils";
import { ControlTypeEnum } from "../../@types/controls/ControlTypes";
import { PlaceHolderTypeEnum } from "../../@types/controls/PlaceHolderTypes";

const BoxStyle = styled(Box)({
  position: "absolute",
  backgroundColor: "#fff",
  borderRadius: 8,
  top: 46,
  right: 20,
  zIndex: 2,
  display: "flex",
  gap: 8,
  flexDirection: "column",
  alignItems: "center",
  padding: 8,
});

const Timer = () => {
  const [show, setShow] = useState(false);
  const { form, timeout } = useFormPage({
    onIndexChanged: (indexes: PageIndexesType) => {
      const control = getControl(form.controls, indexes);
      if (
        control?.type === ControlTypeEnum.PlaceHolder &&
        control.place_holder_info?.type !== PlaceHolderTypeEnum.Note
      ) {
        setShow(false);
      } else {
        setShow(true);
        reset();
      }
    },
  });
  const { time, reset, finished } = useCountdown(
    form.user_start_time || 0,
    form.max_duration || 0,
  );

  useEffect(() => {
    timeout();
  }, [finished, timeout]);

  useEffect(() => {
    const now = Math.floor(new Date().getTime()) / 1000;
    if (form.end_time && form.end_time <= now) {
      timeout();
    }
  }, [form.end_time, timeout, time]);

  if (!form.user_start_time || !form.max_duration || !show) {
    return null;
  }
  return (
    <BoxStyle>
      <Typography>
        <Localizer localeKey="TIMER_REMAIN_DURATION" />
      </Typography>
      <Typography>{time}</Typography>
    </BoxStyle>
  );
};

export default Timer;
