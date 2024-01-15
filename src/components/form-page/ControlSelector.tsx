import {
  ControlType,
  ControlTypeEnum,
} from "../../@types/controls/ControlTypes";
import { hideControlsWithConditionOn } from "../../utils/controlUtils";
import DatePicker from "../controls/DatePicker";
import DropDown from "../controls/DropDown";
import FileUpload from "../controls/FileUpload";
import FormSetGroup from "../controls/FormSetGroup";
import MultipleOption from "../controls/multiple-option/MultipleOption";
import PlaceHolder from "../controls/PlaceHolder";
import TextArea from "../controls/TextArea";
import TextBox from "../controls/TextBox";

const ControlSelector = ({
  control,
  isFloatingBox,
  hideQuestionNumber,
}: {
  control: ControlType;
  isFloatingBox?: boolean;
  hideQuestionNumber?: boolean;
}) => {
  switch (control.type) {
    case ControlTypeEnum.TextBox:
      return <TextBox control={control} isFloatingBox={isFloatingBox} />;
    case ControlTypeEnum.DatePicker:
      return <DatePicker control={control} isFloatingBox={isFloatingBox} />;
    case ControlTypeEnum.DropDown:
      return <DropDown control={control} isFloatingBox={isFloatingBox} />;
    case ControlTypeEnum.FileUpload:
      return <FileUpload control={control} isFloatingBox={isFloatingBox} />;
    case ControlTypeEnum.Group:
      return (
        <FormSetGroup
          controls={hideControlsWithConditionOn(
            control.group_info?.controls || [],
          )}
          control={control}
          isFloatingBox={isFloatingBox}
          hideQuestionNumber={hideQuestionNumber}
        />
      );
    case ControlTypeEnum.MultipleOption:
      return <MultipleOption control={control} />;
    case ControlTypeEnum.PlaceHolder:
      return <PlaceHolder control={control} />;
    case ControlTypeEnum.TextArea:
      return <TextArea control={control} isFloatingBox={isFloatingBox} />;
    default:
      return <></>;
  }
};

export default ControlSelector;
