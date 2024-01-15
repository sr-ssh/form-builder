import React from "react";
import { ViewComponent } from "../ViewComponent";
import ViewContextProvider from "../../context/ViewContextProvider";
import { useViewManage } from "../../hooks/useViewManage";
import {
  onEnterTabContainerConfig,
  closeTabAnimationConfig,
  onLeaveContainerConfig,
  activateTabConfig,
} from "../../utils/viewAnimations";
import { ViewContainerType } from "../../@types/commonView";

const MasterTabContainer = () => {
  const { viewsInfo } = useViewManage(
    ViewContainerType.MasterTab,
    0,
    {
      moveBetweenViews: true,
    },
    activateTabConfig,
    closeTabAnimationConfig,
    activateTabConfig,
    onEnterTabContainerConfig,
    onLeaveContainerConfig,
  );

  return viewsInfo.length === 0 ? (
    <></>
  ) : (
    <div className="tab-wrapper">
      {viewsInfo?.map((viewInfo) => (
        <React.Fragment key={viewInfo.id}>
          <ViewContextProvider viewInfo={viewInfo}>
            <ViewComponent viewInfo={viewInfo} />
          </ViewContextProvider>
        </React.Fragment>
      ))}
    </div>
  );
};

export default MasterTabContainer;
