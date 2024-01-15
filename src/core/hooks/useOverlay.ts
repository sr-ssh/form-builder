import { MutableRefObject } from "react";
import { openView } from "../utils/viewManager";
import { EventType, useEvent } from "./useEvent";

export interface OverlayData<T, U> {
  event: EventType;
  component: (props?: any) => JSX.Element;
  data?: T;
  backdrop?: boolean;
  className?: string;
  positionType?: "ByEvent" | "ByElement";
  position?: "TopLeft" | "TopRight" | "BottomLeft" | "BottomRight";
  getTargetElement?: () => HTMLElement;
  onClose?: (res?: U) => void;
  mapDataTo?: (data?: T) => any;
}

export interface OverlayConfig<T, U> {
  event: EventType;
  component: (props?: any) => JSX.Element;
  backdrop?: boolean;
  className?: string;
  positionType?: "ByEvent" | "ByElement";
  position?: "TopLeft" | "TopRight" | "BottomLeft" | "BottomRight";
  onClose: (res?: U) => void;
  mapDataTo?: (data?: T) => any;
}

export const useOverlay = <T, U>(overlayData: OverlayData<T, U>) => {
  const elRef: MutableRefObject<any> = { current: null };
  useEvent(elRef, overlayData.event, {
    onPress: (e: Event) => openMenu(e),
    onTap: (e: Event) => openMenu(e),
    onDoubleClick: (e: Event) => openMenu(e),
    onRightClick: (e: Event) => openMenu(e),
    onMouseover: (e: Event) => {
      openMenu(e);
    },
  });

  const openMenu = (event: Event | TouchEvent) => {
    openView<T>({
      type: "Overlay",
      component: overlayData.component,
      data: overlayData.mapDataTo
        ? overlayData.mapDataTo(overlayData.data)
        : overlayData.data,
      onClosed: (res?: U) => {
        overlayData.onClose?.(res);
      },
      options: {
        disableBackdrop:
          overlayData.backdrop === undefined || true ? true : false,
        params: {
          event,
          target:
            overlayData.getTargetElement?.() || elRef.current || event.target,
          position: overlayData.position ? overlayData.position : "BottomRight",
        },
      },
    });
  };

  return elRef;
};
