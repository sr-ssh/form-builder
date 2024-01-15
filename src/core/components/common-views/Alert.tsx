import { useView } from "../../hooks/useView";
import { MessageAlert } from "../../@types/commonView";

export function Alert() {
  const { viewData } = useView<MessageAlert>({});

  return (
    <div>
      <span>{viewData.message}</span>
    </div>
  );
}
