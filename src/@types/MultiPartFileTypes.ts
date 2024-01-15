export interface File {
  file_id: string;
  mime: string;
  dc_id: string;
  access_hash_rec: string;
  file_name: string;
}

export enum FileTypeEnum {
  File = "File",
  Image = "Image",
  Voice = "Voice",
  Video = "Video",
  Music = "Music",
  Gif = "Gif",
}

export enum MediaTypeEnum {
  Chat = "Chat",
  Media = "Media",
  Music = "Music",
  Voice = "Voice",
  File = "File",
}

export interface FileInline {
  file_id: string;
  mime: string;
  access_hash_rec?: string;
  file_name: string;
  thumb_inline?: string;
  width?: string;
  height?: string;
  time?: number;
  size: number;
  type?: FileTypeEnum;
  music_performer?: string;
  file_data?: any;
  access_hash_send?: string;
  dc_url?: string;
}

export interface SendFileInput {
  part_number: string;
  total_part: string;
  access_hash_send: string;
  file_id: string;
  dc_url: string;
  bytes: any;
  size: any;
}

export interface SendFileModel {}

export interface SendFileOutput {
  access_hash_rec: string;
}

export interface RequestSendFileOutput {
  id: string;
  dc_id: string;
  access_hash_send: string;
  upload_url: string;
}

export interface RequestSendFileInput {
  size: number;
  mime: string;
  file_name: string;
}

export interface GetFileInput {
  auth: string;
  file_id: string;
  access_hash_rec: string;
  start_index: string;
  last_index: string;
}

export interface GetFileOutput {
  total_length: string;
}

export interface GetFileModel {
  start_index: string;
  last_index: string;
  access_hash_rec: string;
  file_id: string;
  dc_url: string;
}

export interface UploadRequest {
  file_id: string;
  access_hash_send: string;
  dc_id: string;
  file: any;
}

export interface ImageSize {
  width: number;
  height: number;
  enabledCrop?: boolean;
}

export interface UploadInput {
  imageSize: ImageSize;
  thumbSize?: ImageSize;
  resizedImage?: any;
  notify?: (data: any) => void;
}

export interface UploadOutput {
  isSuccess?: boolean;
  exp?: string;
  text?: string;
  files?: FileInline[];
}

export interface ResizeOutput {
  image?: any;
}

export interface UploadInfo {
  object_guid?: string;
  file_id: string;
  total_size?: number;
  uploaded_size?: number;
  percent?: number;
  is_done?: boolean;
  blob?: any;
}

export interface FileProgressInfo {
  file_id: string;
  total_size?: number;
  progress_size?: number;
  is_done?: boolean;
  canceled?: boolean;
  percent?: number;
  blob?: any;
}

export interface MediaTime {
  id: string;
  current?: number;
  total?: number;
  percent?: number;
}

export enum MediaPlayAction {
  Play = "Play",
  Pause = "Pause",
  End = "End",
  Stop = "Stop",
  Seek = "Seek",
  Download = "Download",
}

export enum PlayRepeatMode {
  Off = 0,
  All = 1,
  One = 2,
}

export interface MediaPlay {
  // message: Message;
  message: any;
  action: MediaPlayAction;
  playing?: boolean;
  current?: number;
  // chat?: Chat;
  chat?: any;
  blob?: any;
}

export enum UploadModalAction {
  Upload,
  Select,
}

export enum UploadFileType {
  Image = 1,
  File = 2,
}

export interface FileUploadEventArg {
  files: any[];
  object_guid: any;
  button_id?: any;
  asImage?: boolean;
}

export interface ImageFile {
  thumbnail: FileInline;
  main: FileInline;
}

export interface UploadOptions {
  cancel?: (reason?: string) => void;
  notify: (data: NotifyType) => void;
  shouldCompress?: boolean;
  shouldResize?: boolean;
  maxPixel?: number;
  compressQuality?: number;
}

export type NotifyType = {
  file_id: string;
  uploaded_size?: number;
  percent: number;
  total_size?: number;
  is_done?: boolean;
  blob?: any;
};
