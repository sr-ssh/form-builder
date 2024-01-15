import { ControlType } from "../../@types/controls/ControlTypes";
import { useFBRegisterControl } from "../../hooks/useFBRegisterControl";
import { useFBControl } from "../../hooks/useFBControl";
import { AdapterDateFnsJalali } from "@mui/x-date-pickers/AdapterDateFnsJalali";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dateTimePickerStyle from "../../utils/theme/dateTimePickerStyle";
import { useGlobalLocales } from "../../hooks/useGlobalLocales";
import { MobileDatePicker, MobileTimePicker } from "@mui/x-date-pickers";
import { DatePickerTypeEnum } from "../../@types/controls/DatePickerTypes";
import { ThemeProvider, createTheme, useTheme } from "@mui/material";

type DatePickerPropsType = {
  control: ControlType;
  isFloatingBox?: boolean;
};

const DatePicker = ({ control, isFloatingBox }: DatePickerPropsType) => {
  const theme = useTheme();
  const { lang } = useGlobalLocales();
  let { onChange, onBlur, name, defaultValue } = useFBRegisterControl(control);
  const { getControlErrors, isDisabled } = useFBControl(control);

  const datePickerTheme = createTheme({
    direction: "rtl",
    typography: {
      fontFamily: theme.fontName,
      fontSize: 16,
    },
  });

  const isJalali =
    control.date_picker_info?.type !== DatePickerTypeEnum.Christian;
  const hasTime = control.date_picker_info?.type === DatePickerTypeEnum.Time;

  const datePickerProps = {
    sx: {
      ...dateTimePickerStyle(theme),
    },
    defaultValue,
    // inputRef: ref,
    onChange: (value: any) =>
      onChange({
        target: {
          value: value?.getTime?.(),
          name: control.control_id,
        },
      }),
    slotProps: {
      textField: (params: any) => ({
        label: isFloatingBox ? control.label_text : "",
        onBlur,
        name,
        error: !!getControlErrors()?.type,
        sx: {
          ...(params?.sx || {}),
          direction: "rtl",
        },
      }),
      toolbar: {
        hidden: true,
        sx: {
          ".MuiDateTimePickerToolbar-dateContainer": {
            ".MuiTypography-h4": { fontSize: "2rem" },
          },
          ".MuiDateTimePickerToolbar-timeDigitsContainer": {
            "button, span": { fontSize: "2.5rem" },
          },
          ".MuiDateTimePickerToolbar-ampmSelection": {
            "button, span": { fontSize: "14px" },
          },
        },
      },
      layout: {
        sx: {
          ".MuiDayCalendar-weekDayLabel": {
            fontSize: "18px",
            fontWeight: 500,
          },
          ".MuiPickersDay-root": {
            fontSize: "16px",
          },
          ".muirtl-j6lryb-MuiButtonBase-root-MuiTab-root.Mui-selected": {
            color: "#000",
          },
          ".muirtl-1aquho2-MuiTabs-indicator": {
            backgroundColor: "#000",
          },
          ".muirtl-ia2qij-MuiButtonBase-root-MuiPickersDay-root.Mui-selected": {
            backgroundColor: "#999 !important",
          },
          ".muirtl-umzx0k-MuiClock-pin": {
            backgroundColor: "#999 !important",
          },
          ".muirtl-d0vs79-MuiClockPointer-root": {
            backgroundColor: "#999 !important",
          },
          ".muirtl-eg3pzz-MuiClockPointer-thumb": {
            backgroundColor: "#999 !important",
            borderColor: "#999 !important",
          },
          ".muirtl-xsbr3j-MuiButtonBase-root-MuiButton-root": {
            color: "#000",
          },
        },
      },
    },
  };

  return (
    <ThemeProvider theme={datePickerTheme}>
      <LocalizationProvider
        dateAdapter={isJalali ? AdapterDateFnsJalali : AdapterDateFns}
        localeText={{
          okButtonLabel: lang("CALENDAR_OK_BUTTON"),
          cancelButtonLabel: lang("CALENDAR_CANCEL_BUTTON"),
        }}
      >
        {hasTime ? (
          <MobileTimePicker disabled={isDisabled} {...datePickerProps} />
        ) : (
          <MobileDatePicker disabled={isDisabled} {...datePickerProps} />
        )}
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default DatePicker;
