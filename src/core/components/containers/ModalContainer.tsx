import React, { useEffect, useRef } from "react";
import { ViewEvent } from "../../@types/view";
import { ViewComponent } from "../ViewComponent";
import ViewContextProvider from "../../context/ViewContextProvider";
import { useViewManage } from "../../hooks/useViewManage";
import { bezier } from "../../utils/bezier";
import { closeView } from "../../utils/viewManager";
import { ViewContainerType } from "../../@types/commonView";

const ModalContainer = () => {
  const slideIn = bezier(0.25, 1, 0.5, 1);
  const backDropRef = useRef<any>(null);

  const { viewsInfo } = useViewManage(
    ViewContainerType.Modal,
    4,
    {},
    {
      duration: 300,
      start(newView, prevView) {
        const newViewStyle = newView.ref.style;
        newViewStyle.display = "block";
        newViewStyle.opacity = "0";
        newViewStyle.marginTop = -newView.ref.offsetHeight / 2 + "px";
        const length = viewsInfo.length;
        newViewStyle.zIndex = length + 1 + "";
        newViewStyle.transform = "translateY(20%)";

        if (prevView?.ref) {
          prevView.ref.style.zIndex = length - 1 + "";
        }
        backDropRef.current.style.zIndex = length + "";
      },
      animate(t, newView, prevView) {
        const p = slideIn(t);
        const newViewStyle = newView.ref.style;
        if (viewsInfo.length === 1) {
          backDropRef.current.style.opacity = `${p}`;
        }
        newViewStyle.opacity = `${p}`;
        newViewStyle.transform = `translateY(${20 - p * 20}%)`;
      },
      end(newView, prevView) {},
    } as ViewEvent,
    {
      duration: 300,
      start(closeViewEl, activeViewEl) {
        const closedViewStyle = closeViewEl.ref.style;
        const activeViewStyle = activeViewEl?.ref.style;
        if (activeViewStyle) {
          activeViewStyle.opacity = "0";
          activeViewStyle.zIndex = viewsInfo.length + 1 + "";
        }
        closedViewStyle.opacity = "1";
      },
      animate(t, closeViewEl, activeViewEl) {
        const closedViewStyle = closeViewEl.ref.style;
        const activeViewStyle = activeViewEl?.ref.style;
        const p = slideIn(t);

        closedViewStyle.opacity = `${1 - p}`;
        closedViewStyle.transform = `translateY(${p * 20}%)`;
        if (viewsInfo.length === 1) {
          backDropRef.current.style.opacity = `${1 - p}`;
        }

        if (activeViewStyle) {
          activeViewStyle.opacity = `${p}`;
        }
      },
      end(closeViewEl, activeViewEl) {
        const closedViewStyle = closeViewEl.ref.style;
        closedViewStyle.display = "none";
        backDropRef.current.style.zIndex = viewsInfo.length.toString();
      },
    } as ViewEvent,
  );

  useEffect(() => {}, []);

  const closeModal = () => {
    if (viewsInfo.length === 0) {
      return;
    }
    const topViewInfo = viewsInfo.last();
    const view = topViewInfo.view;
    if (view.options?.disableBackdrop) {
      view.options.onClickedBackdrop?.();
      return;
    }
    closeView(view.id, view.type);
  };

  return (
    <div className={viewsInfo.length === 0 ? "hidden" : "modal-container"}>
      <div
        ref={backDropRef}
        onClick={closeModal}
        className={viewsInfo.length === 0 ? "" : "modal-backdrop"}
      />
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

export default ModalContainer;
