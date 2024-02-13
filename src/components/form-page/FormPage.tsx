import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import PartialTabContainer from "../../core/components/containers/PartialTabContainer";
import theme from "../../utils/theme/theme";
import BackgroundStyle from "./BackgroundStyle";
import form from "../../healthTest.json";
import { ThemeType } from "../../@types/ThemeTypes";
import { FormType, LocaleEnum } from "../../@types/FormTypes";
import { FormPageContextProvider } from "../../context/FormPageContextProvider";
import Footer from "./footer/Footer";
import { Localizer } from "../shared/Localizer";
import { CircularProgress, ThemeProvider, styled } from "@mui/material";
import Timer from "../shared/Timer";
import rtlPlugin from "stylis-plugin-rtl";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { prefixer } from "stylis";
import { useEffect } from "react";
import { AxiosApi } from "../../axios";
import Logo from "../shared/Logo";
import MyStepper from "../shared/MyStepper";

const NoActiveMessage = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#fff",
  minHeight: "2.5rem",
  height: "51px",
  color: "#fff",
  userSelect: "none",
  boxShadow: "0px 4px 4px 0px #00000014",
  zIndex: 2,
});

const LoadingStyle = styled(CircularProgress)({
  position: "relative",
  right: "44%",
  top: "50%",
});

const FormPage = () => {
  // const [formData, setFormData] = useState<FormType>();
  const formData = form as unknown as FormType;
  const formTheme = form.theme as ThemeType;

  const cacheRtl = createCache({
    key: "muirtl",
    stylisPlugins: [prefixer, rtlPlugin],
  });

  const emptyCache = createCache({
    key: "meaningless-key",
  });

  switch (form.locale) {
    case LocaleEnum.English:
      (window as any).lang = "en";
      document.getElementById("root")?.setAttribute("dir", "ltr");
      document.documentElement?.setAttribute("dir", "ltr");
      break;
    case LocaleEnum.Persian:
      (window as any).lang = "fa";
      document.getElementById("root")?.setAttribute("dir", "rtl");
      document.documentElement?.setAttribute("dir", "rtl");
      break;
    default:
      (window as any).lang = "fa";
      document.getElementById("root")?.setAttribute("dir", "rtl");
      document.documentElement?.setAttribute("dir", "rtl");
      break;
  }

  useEffect(() => {
    AxiosApi.GetForm({ form_id: "6592bbc3eb4b963b4936e94f" })
      .then((res) => {
        // if (res?.form) setFormData(res.form);
      })
      .catch((err) => console.error(err));
  }, []);

  if (!formData || !formData.controls) {
    return <LoadingStyle />;
  }

  return (
    <CacheProvider
      value={formData.locale === LocaleEnum.English ? emptyCache : cacheRtl}
    >
      <ThemeProvider theme={theme({ formTheme, locale: formData.locale })}>
        <FormPageContextProvider form={formData}>
          <BackgroundStyle>
            <NoActiveMessage>
              {/* <Typography fontSize={14}> */}
              {/* <Localizer localeKey="FORM_DISABLED" /> */}
              {/* </Typography> */}
            </NoActiveMessage>
            <Timer />
            {formData.layout?.has_logo && <Logo logo={formData.logo_url} />}
            <MyStepper />
            <Box position="relative" flex="1 1 auto" height="100%">
              <PartialTabContainer
                className="form-wrapper"
                containerName="FormContainer"
              />
            </Box>
            <Footer />
          </BackgroundStyle>
        </FormPageContextProvider>
      </ThemeProvider>
    </CacheProvider>
  );
};

export default FormPage;
