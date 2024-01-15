export enum FileTypeEnum {
  Image = "Image",
  Video = "Video",
  Voice = "Voice",
  Doc = "Doc",
  Zip = "Zip",
  Any = "Any",
}

export type FileUploadType = {
  file_type?: FileTypeEnum;
  allowed_extensions?: string[];
  max_size?: number;
};
