import { useContext } from "react";
import { ControlType } from "../@types/controls/ControlTypes";
import { FBContext } from "../context/FBContextProvider";

export const useFBRegisterControl = (control: ControlType) => {
  const { registerControl, getDefaultValue } = useContext(FBContext);

  return {
    ...registerControl(control),
    defaultValue: getDefaultValue(control.control_id),
  };
};
