import Menu, { MenuOptions, Option } from "../components/common-views/Menu";
import { OverlayData, useOverlay } from "./useOverlay";

export interface OverlayMenuConfig
  extends Omit<OverlayData<MenuOptions, Option>, "component"> {}

export const useOverlayMenu = (menuData: OverlayMenuConfig) => {
  const elRefMenu = useOverlay<MenuOptions, Option>({
    event: menuData.event,
    component: Menu,
    data: menuData.data,
    backdrop: menuData.backdrop,
    position: menuData.position,
    onClose: menuData.onClose,
    getTargetElement: menuData.getTargetElement,
    mapDataTo: menuData.mapDataTo,
  });

  return elRefMenu;
};
