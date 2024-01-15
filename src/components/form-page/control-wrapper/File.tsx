import { ControlType } from "../../../@types/controls/ControlTypes";
import Box from "@mui/material/Box";
import FileDisplay from "../../shared/FileDisplay";

type FilePropsType = {
  control: ControlType;
};

const File = ({ control }: FilePropsType) => (
  <>
    {control.file_url && (
      <Box marginBlock={2}>
        <FileDisplay fileUrl={control.file_url} />
      </Box>
    )}
  </>
);

export default File;
