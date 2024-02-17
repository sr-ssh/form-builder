import Box from "@mui/material/Box";
import PartialTabContainer from "../../core/components/containers/PartialTabContainer";
import theme from "../../utils/theme/theme";
import BackgroundStyle from "./BackgroundStyle";
import form from "../../healthTest.json";
import { ThemeType } from "../../@types/ThemeTypes";
import { FormType, LocaleEnum } from "../../@types/FormTypes";
import { FormPageContextProvider } from "../../context/FormPageContextProvider";
import Footer from "./footer/Footer";
import { CircularProgress, ThemeProvider, styled } from "@mui/material";
import Timer from "../shared/Timer";
import rtlPlugin from "stylis-plugin-rtl";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { prefixer } from "stylis";
import Logo from "../shared/Logo";
import MyStepper from "../shared/MyStepper";
import Header from "./Header";

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
            {/* <Header /> */}
            {/* <Timer /> */}
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
