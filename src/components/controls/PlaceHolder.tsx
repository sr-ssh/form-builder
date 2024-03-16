import { ControlType } from "../../@types/controls/ControlTypes";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { toDate } from "date-fns";
import { format } from "date-fns-jalali";
import placeHolderStyle from "../../utils/theme/placeHolderStyle";
import { useFormPage } from "../../hooks/useFormPage";
import { PlaceHolderTypeEnum } from "../../@types/controls/PlaceHolderTypes";
import { Localizer } from "../shared/Localizer";
import { useTheme } from "@mui/material";
import { formatDuration } from "../../utils/date";

type PlaceHolderPropsType = {
  control: ControlType;
};

const PlaceHolder = ({ control }: PlaceHolderPropsType) => {
  const placeHolderInfo = control.place_holder_info;
  const isStart = placeHolderInfo?.type === PlaceHolderTypeEnum.Start;
  const { submitNext, form } = useFormPage({});
  const theme = useTheme();

  const now = Math.floor(new Date().getTime()) / 1000;
  const hasFormStarted =
    form.start_time !== undefined ? now >= form.start_time : true;
  const hasFormFinished =
    form.end_time !== undefined ? now >= form.end_time : false;

  let remainDuration,
    hasRemainDuration = true;
  if (form.user_start_time && form.max_duration) {
    remainDuration =
      form.max_duration - (new Date().getTime() - form.user_start_time) / 1000;
    hasRemainDuration = remainDuration > 0;
  }

  return (
    <Box display="grid" gap={2} sx={placeHolderStyle(theme)}>
      <Typography>{placeHolderInfo?.description}</Typography>
      {isStart && (
        <>
          {form.start_time ? (
            <Typography>
              <Localizer
                localeKey="PLACEHOLDER_START_TIME"
                params={{
                  startTime: format(
                    toDate(form.start_time * 1000),
                    "hh:mm yyyy/MM/dd",
                  ),
                }}
              />
            </Typography>
          ) : null}
          {form.end_time ? (
            <Typography>
              <Localizer
                localeKey="PLACEHOLDER_END_TIME"
                params={{
                  endTime: format(
                    toDate(form.end_time * 1000),
                    "hh:mm yyyy/MM/dd",
                  ),
                }}
              />
            </Typography>
          ) : null}
          {hasRemainDuration && remainDuration ? (
            <Typography>
              <Localizer
                localeKey="PLACEHOLDER_REMAIN_DURATION"
                params={{
                  remainDuration: formatDuration(remainDuration * 1000),
                }}
              />
            </Typography>
          ) : null}
        </>
      )}
      {isStart && hasFormStarted && !hasFormFinished && hasRemainDuration && (
        <Button sx={{ justifySelf: "center" }} onClick={() => submitNext()}>
          {placeHolderInfo.start_caption || (
            <Localizer localeKey="PLACEHOLDER_START_BUTTON" />
          )}
        </Button>
      )}
    </Box>
  );
};

export default PlaceHolder;
