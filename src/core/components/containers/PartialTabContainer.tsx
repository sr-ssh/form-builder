import React, { useRef } from "react";
import { ViewComponent } from "../ViewComponent";
import ViewContextProvider from "../../context/ViewContextProvider";
import { useViewManage } from "../../hooks/useViewManage";
import { ViewEvent } from "../../@types/view";
import { bezier } from "../../utils/bezier";

const PartialTabContainer = ({
  containerName,
  className,
}: {
  containerName: string;
  className: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const openConfig: ViewEvent = {
    duration: 400,
    start(newViewEl, prevViewEl) {
      const containerEl = containerRef.current;
      const newStyle = newViewEl.ref.style;
      let prevStyle = prevViewEl?.ref.style;
      if (containerEl && viewsInfo.length <= 1) {
        console.log(containerEl.offsetWidth);
        containerEl.style.marginLeft = `${-containerEl.offsetWidth * 1.5}px`;
        console.log(containerEl.style.marginLeft);
        containerEl.style.display = "block";
      } else {
        if (prevStyle) {
          prevStyle.position = "absolute";
          prevStyle.top = "0";
          prevStyle.width = "100%";
          prevStyle.zIndex = "2";
        }
        if (newStyle) {
          newStyle.display = "block";
          newStyle.opacity = "1";
          newStyle.zIndex = "2";
        }
      }
    },
    animate(t, newViewEl, prevViewEl) {
      const containerEl = containerRef.current;
      const newStyle = newViewEl.ref.style;
      const prevStyle = prevViewEl?.ref.style;
      const p = bezier(0.25, 1, 0.5, 1)(t);
      if (containerEl && viewsInfo.length <= 1) {
        containerEl.style.marginLeft = `${
          (p - 1) * containerEl.offsetWidth * 1.5
        }px`;
        if (prevStyle) {
          prevStyle.transform = `translateX(-${(p - 1) * 0.1 * 100}%)`;
        }
      } else {
        if (prevStyle) {
          console.log("containerEl.style.marginLeft");
          prevStyle.transform = `translateX(${p * 100}%)`;
        }
        if (newStyle) {
          newStyle.transform = `translateX(${(p - 1) * 100}%)`;
        }
      }
    },
    end(newViewEl, prevViewEl) {
      const prevStyle = prevViewEl?.ref.style;
      if (prevStyle) {
        prevStyle.display = "none";
      }
    },
  };
  let closeConfig: ViewEvent = {
    duration: 400,
    start(closeViewEl, activeViewEl) {
      console.log("closing");
      const containerEl = containerRef.current;
      if (containerEl && viewsInfo.length <= 1) {
        containerEl.style.display = "block";
      } else {
        const newStyle = activeViewEl?.ref.style;
        const prevStyle = closeViewEl?.ref.style;
        if (newStyle) {
          newStyle.display = "block";
          newStyle.zIndex = "2";
          newStyle.transform = "translateX(100%)";
        }
        if (prevStyle) {
          prevStyle.zIndex = "1";
        }
      }
    },
    animate(t, closeViewEl, activeViewEl) {
      const containerEl = containerRef.current;
      const activeStyle = activeViewEl?.ref.style;
      const closeStyle = closeViewEl.ref.style;
      const p = bezier(0.25, 1, 0.5, 1)(t);
      if (containerEl && viewsInfo.length <= 1) {
        containerEl.style.marginLeft = `${-p * containerEl?.offsetWidth}px`;
      } else {
        if (activeStyle) {
          activeStyle.transform = `translateX(${(1 - p) * 100}%)`;
        }
        if (closeStyle) {
          closeStyle.transform = `translateX(${-p * 100}%)`;
        }
      }
    },
    end(closeView, activeView) {
      const containerEl = containerRef.current;
      const activeStyle = activeView?.ref.style;
      const closeStyle = closeView?.ref.style;
      if (activeStyle) {
        activeStyle.opacity = "1";
      }
      if (containerEl && viewsInfo.length <= 1) {
        containerEl.style.display = "none";
      } else {
        if (closeStyle) {
          closeStyle.opacity = "0";
          closeStyle.display = "none";
        }
      }
    },
  };
  const { viewsInfo } = useViewManage(
    containerName,
    0,
    { moveBetweenViews: true },
    openConfig,
    closeConfig,
  );

  return viewsInfo.length === 0 ? (
    <></>
  ) : (
    <div ref={containerRef} className={"partial-tab-container " + className}>
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
