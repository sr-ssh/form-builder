import { ReactNode, useEffect, useRef } from "react";

const ElementRef = ({
  className,
  children,
  onLoad,
}: {
  className: string;
  children?: ReactNode;
  onLoad?: (ref: HTMLElement) => void;
}) => {
  const elRef = useRef<any>();
  useEffect(() => {
    onLoad?.(elRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={elRef} className={className}>
      {children}
    </div>
  );
};

export default ElementRef;
