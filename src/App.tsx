import { useEffect } from "react";
import TabContainer from "./core/components/containers/TabContainer";
import ModalContainer from "./core/components/containers/ModalContainer";
import MasterTabContainer from "./core/components/containers/MasterTabContainer";
import ToastContainer from "./core/components/containers/ToastContainer";
import BottomSheetContainer from "./core/components/containers/BottomSheetContainer";
import { openView } from "./core/utils/viewManager";
import { ViewContainerType } from "./core/@types/commonView";
import {} from "./core/utils/extensions";
import OverlayContainer from "./core/components/containers/OverlayContainer";
import rtlPlugin from "stylis-plugin-rtl";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { prefixer } from "stylis";
import FormPage from "./components/form-page/FormPage";

function App() {
  // Create rtl cache

  useEffect(() => {
    openView({
      type: ViewContainerType.MasterTab,
      component: FormPage,
    });
  }, []);

  return (
    <>
      <MasterTabContainer />
      <TabContainer />
      <ModalContainer />
      <BottomSheetContainer />
      <ToastContainer />
      <OverlayContainer />
    </>
  );
}

export default App;
