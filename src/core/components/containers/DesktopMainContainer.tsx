import React from "react";
import { ViewComponent } from "../ViewComponent";
import ViewContextProvider from "../../context/ViewContextProvider";
import { useViewManage } from "../../hooks/useViewManage";

const DesktopMainContainer = () => {
  const { viewsInfo } = useViewManage(
    "MasterMiddle",
    0,
    { moveBetweenViews: true },
    {
      duration: 0,
      start(newViewEl, prevViewEl) {
        const newElStyle = newViewEl.ref.style;
        newElStyle.display = "block";
        newElStyle.opacity = "1";
        const prevElStyle = prevViewEl?.ref.style;
        if (prevElStyle) {
          prevElStyle.opacity = "0";
        }
        const prevViewStyle = prevViewEl?.ref.style;
        if (prevViewStyle) {
          prevViewStyle.display = "none";
        }
      },
    },
    {},
    {
      duration: 0,
      start(newViewEl, prevViewEl) {
        const newElStyle = newViewEl.ref.style;
        newElStyle.display = "block";
        newElStyle.opacity = "1";
        const prevElStyle = prevViewEl?.ref.style;
        if (prevElStyle) {
          prevElStyle.opacity = "0";
        }
        const prevViewStyle = prevViewEl?.ref.style;
        if (prevViewStyle) {
          prevViewStyle.display = "none";
        }
      },
    },
  );

  return viewsInfo.length === 0 ? (
    <></>
  ) : (
    <div className="master-middle-container">
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

export default DesktopMainContainer;
