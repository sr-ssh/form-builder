import { useEffect, useCallback, useState } from "react";
import { IObservable, ObservableActionType } from "../stores/observable";

export const useObservable = <T>(
  observable: IObservable<T>,
  subject: T,
  update?: (subject: T) => void,
  remove?: (subject: T) => void,
) => {
  const [subjectState, setSubjectState] = useState<T>(subject);

  const subscribe = useCallback((action: ObservableActionType, subject: T) => {
    switch (action) {
      case "Update":
        setSubjectState({ ...subject });
        update?.(subject);
        break;
      case "Delete":
        remove?.(subject);
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(
    () => {
      observable.on(subject, subscribe);

      return () => {
        observable.off(subject, subscribe);
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return subjectState;
};
