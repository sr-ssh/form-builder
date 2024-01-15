import { Box, Typography } from "@mui/material";

const FileDisplay = ({ fileUrl, file }: { fileUrl: string; file?: File }) => {
  let fileExtension = fileUrl.split(".").pop()?.toLowerCase();
  if (file) {
    fileExtension = file.type.split("/")?.[0];
  }

  if (
    fileExtension === "mp4" ||
    fileExtension === "webm" ||
    fileExtension === "video"
  ) {
    return (
      <video controls width="100%">
        <source src={fileUrl} type={`video/${fileExtension}`} />
        Sorry, your browser doesn't support embedded videos.
      </video>
    );
  }

  if (
    fileExtension === "jpg" ||
    fileExtension === "jpeg" ||
    fileExtension === "png" ||
    fileExtension === "image"
  ) {
    return <img src={fileUrl} alt="File" width="100%" />;
  }

  if (
    fileExtension === "mp3" ||
    fileExtension === "wav" ||
    fileExtension === "ogg" ||
    fileExtension === "aac" ||
    fileExtension === "flac" ||
    fileExtension === "webm" ||
    fileExtension === "audio"
  ) {
    return <audio src={fileUrl} controls />;
  }

  // Handle other file types (e.g., documents, zip files) as needed
  return (
    <Box display="flex" flexDirection="column">
      <a href={fileUrl}>
        <img
          width="40"
          height="100%"
          src="/assets/images/file.svg"
          alt="file"
        />
      </a>
      {file?.name && <Typography variant="caption">{file.name}</Typography>}
    </Box>
  );
};

export default FileDisplay;
