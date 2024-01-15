import React from "react";
import { ViewComponent } from "../ViewComponent";
import ViewContextProvider from "../../context/ViewContextProvider";
import { useViewManage } from "../../hooks/useViewManage";
import {
  closeTabAnimationConfig,
  onLeaveContainerConfig,
  openTabContainerConfig,
  slideIn,
} from "../../utils/viewAnimations";

const PartialTabContainer = ({
  containerName,
  className,
}: {
  containerName: string;
  className: string;
}) => {
  const { viewsInfo } = useViewManage(
    containerName,
    0,
    { moveBetweenViews: true },
    {
      duration: 400,
      start(newView, prevView) {
        const newStyle = newView.ref.style;
        const prevStyle = prevView?.ref?.style;
        newStyle.display = "block";
        newStyle.zIndex = "2";

        if (prevStyle) {
          prevStyle.zIndex = "1";
        }
      },
      animate(t, newView, prevView) {
        const p = slideIn(t);
        const newStyle = newView.ref.style;
        const prevStyle = prevView?.ref?.style;
        newStyle.opacity = `${p}`;

        if (prevStyle) {
          prevStyle.opacity = `${1 - p}`;
          //prevStyle.filter = `brightness(${(1 - t) * 20 + 80}%)`;
        }
      },
      end(newView, prevView) {
        const prevStyle = prevView?.ref?.style;
        if (prevStyle) {
          prevStyle.display = "none";
        }
      },
    },
    {
      duration: 400,
      start(closeView, activeView) {
        const closeStyle = closeView.ref.style;
        const activeStyle = activeView?.ref.style;
        closeStyle.display = "1";
        if (activeStyle) {
          activeStyle.display = "block";
          activeStyle.opacity = "1";
        }
      },
      animate(t, closeView, activeView) {
        const closeStyle = closeView.ref.style;
        const activeStyle = activeView?.ref.style;

        const p = slideIn(t);
        closeStyle.opacity = `${1 - p}`;
        if (activeStyle) {
          //activeStyle.filter = `brightness(${t * 20 + 80}%)`;
          activeStyle.opacity = `${p}`;
        }
      },
      end(closeView, activeView) {
        const closeStyle = closeView.ref.style;
        const activeStyle = activeView?.ref.style;

        closeStyle.opacity = "0";
        closeStyle.display = "none";
        if (activeStyle) {
          activeStyle.opacity = "1";
        }
      },
    },
    openTabContainerConfig,
    openTabContainerConfig,
    onLeaveContainerConfig,
  );

  return viewsInfo.length === 0 ? (
    <></>
  ) : (
    <div className={"partial-tab-container " + className}>
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

export default PartialTabContainer;
