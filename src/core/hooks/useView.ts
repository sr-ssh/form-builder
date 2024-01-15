import { CloseType, ViewEvents, ViewType } from "../@types/view";
import { useContext, useEffect } from "react";
import { ViewContext } from "../context/ViewContextProvider";

export const useView = <T = any>(events?: ViewEvents) => {
  const viewContext = useContext(ViewContext);

  useEffect(() => {
    if (events) {
      const unListener = viewContext.listenEvents(events);
      return () => {
        unListener();
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const close = (res?: any) => {
    closeByType("Current", res);
  };

  const closeByType = (closeType: CloseType, res?: any) => {
    viewContext.close?.(closeType, res);
  };

  const openView = (view: Omit<ViewType<T>, "type">) => {
    viewContext.openView?.(view);
  };

  return {
    close,
    closeByType,
    openView,
    viewData: viewContext.getViewData() as T,
  };
};
