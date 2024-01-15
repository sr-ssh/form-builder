import { ReactNode, useEffect, useRef } from "react";
import { EventType, useEvent } from "../hooks/useEvent";
import { ViewInfo } from "../@types/view";

export function Scrollable({
  children,
  viewInfo,
}: {
  children: ReactNode;
  viewInfo: ViewInfo;
}) {
  const elRef2 = useRef<HTMLElement | undefined>();
  const { updateRef } = useEvent(elRef2, EventType.VerticalSwipe, {
    onTouchMove: () => {
      console.log("Move horizontal");
    },
    onTouchStart: () => {
      console.log("Start move horizontal");
    },
    onTouchEnd: () => {
      console.log("End move horizontal");
    },
  });

  useEffect(() => {
    elRef2.current = viewInfo.elRef;
    updateRef();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <>{children}</>;
}
