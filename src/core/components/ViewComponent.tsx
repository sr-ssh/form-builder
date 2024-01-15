import { Suspense, useEffect, useRef } from "react";
import { ErrorBoundaryWrapper } from "./common-views/ErrorBoundaryWrapper";
import { ViewInfo } from "../@types/view";

export function ViewComponent({ viewInfo }: { viewInfo: ViewInfo }) {
  const elRef = useRef<any>(null);
  const className = viewInfo.view.className;

  useEffect(() => {
    viewInfo.elRef = elRef.current;
    viewInfo.onInit?.(elRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const View = viewInfo.view.component;

  return (
    <div
      ref={elRef}
      className={"view-wrapper" + (className ? ` ${className}` : "")}
    >
      <ErrorBoundaryWrapper>
        <Suspense fallback="loading...">
          <View />
        </Suspense>
      </ErrorBoundaryWrapper>
    </div>
  );
}
