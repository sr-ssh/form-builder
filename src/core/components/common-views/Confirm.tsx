import { MessageConfirm } from "../../@types/commonView";
import { useView } from "../../hooks/useView";

export function Confirm() {
  const { close, viewData } = useView<MessageConfirm>({});

  return (
    <>
      <div className="confirm-card">{viewData?.message}</div>
      <div className="d-flex mt-3">
        <div style={{ paddingRight: ".5rem", width: "50%" }}>
          <button
            className="btn btn-warning w-100"
            onClick={() => close({ res: false })}
          >
            خیر
          </button>
        </div>
        <div style={{ paddingLeft: ".5rem", width: "50%" }}>
          <button
            className="btn btn-primary w-100"
            onClick={() => close({ res: true })}
          >
            بله
          </button>
        </div>
      </div>
    </>
  );
}
