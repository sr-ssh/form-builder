import { memo } from "react";
import { ControlType } from "../../../@types/controls/ControlTypes";
import MultiSelect from "./MultiSelect";
import UniSelect from "./UniSelect";

type MultipleOptionPropsType = {
  control: ControlType;
};

const MultipleOption = ({ control }: MultipleOptionPropsType) => {
  const info = control.multiple_option_info;

  return (
    <>
      {info?.multi_select ? (
        <MultiSelect control={control} />
      ) : (
        <UniSelect control={control} />
      )}
    </>
  );
};

export default memo(MultipleOption);
