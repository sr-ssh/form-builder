import React from "react";
import { ViewComponent } from "../ViewComponent";
import ViewContextProvider from "../../context/ViewContextProvider";
import { useViewManage } from "../../hooks/useViewManage";
import {
  onCloseToastConfig,
  onOpenToastConfig,
} from "../../utils/viewAnimations";
import { ViewContainerType } from "../../@types/commonView";

const ToastContainer = () => {
  const { viewsInfo } = useViewManage(
    ViewContainerType.Toast,
    5,
    { disableBrowserHistory: true },
    onOpenToastConfig,
    onCloseToastConfig,
  );

  return viewsInfo.length === 0 ? (
    <></>
  ) : (
    <React.Fragment>
      <div className="toasts-container">
        {viewsInfo?.map((viewInfo) => (
          <React.Fragment key={viewInfo.id}>
            <ViewContextProvider viewInfo={viewInfo}>
              <ViewComponent viewInfo={viewInfo} />
            </ViewContextProvider>
          </React.Fragment>
        ))}
      </div>
    </React.Fragment>
  );
};

export default ToastContainer;
