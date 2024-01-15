import { useEffect, useRef } from "react";
import { useView } from "../../hooks/useView";
import { MessageToast } from "../../@types/commonView";

export function Toast() {
  const timer = useRef<NodeJS.Timeout>();

  const { close, viewData } = useView<MessageToast>({});

  useEffect(() => {
    if (viewData.delay) {
      timer.current = setTimeout(() => {
        close();
      }, viewData.delay * 1000);
    }
    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-100">
      <div className="row">
        <h1 className="col-8">{viewData.message}</h1>
        <button
          className="col-3 btn btn-success"
          onClick={() => close({ res: true })}
        >
          delete
        </button>
      </div>
    </div>
  );
}
