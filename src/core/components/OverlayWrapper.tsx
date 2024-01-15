import { ReactNode, useEffect, useRef } from "react";
import { OverlayConfig, useOverlay } from "../hooks/useOverlay";

export function ContextMenuWrapper<T, U>({
  children,
  contextMenuConfig,
  data,
  onSelect,
}: {
  children: ReactNode;
  contextMenuConfig: OverlayConfig<T, U>;
  data?: T;
  onSelect?: (res?: U) => void;
}) {
  const elRef = useRef<HTMLElement>(null);

  useEffect(() => {
    menuRef.current = elRef.current?.children[0];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const menuRef = useOverlay<T, U>({
    component: contextMenuConfig.component,
    backdrop: contextMenuConfig.backdrop,
    className: contextMenuConfig.className,
    onClose: (res?: U) => {
      onSelect?.(res);
      contextMenuConfig.onClose(res);
    },
    position: contextMenuConfig.position,
    positionType: contextMenuConfig.positionType,
    event: contextMenuConfig.event,
    data,
    mapDataTo: contextMenuConfig.mapDataTo,
  });

  return <span ref={elRef}>{children}</span>;
}
