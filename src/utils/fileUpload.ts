import { SendFileHeaderDateType } from "../@types/AxiosApiTypes";
import { FileInline, UploadOptions } from "../@types/MultiPartFileTypes";
import { Deferred } from "./Deferred";
// import { getCurrentUserFromStorage } from "./auth";

let requestPulls: any = {};

let requestActives: any = {};

// using
export const uploadFile = async (
  file_inline: FileInline,
  requestSendFile: (data?: any) => Promise<any>,
  sendFile: ({
    data,
    headers,
  }: {
    data: any;
    headers: SendFileHeaderDateType;
  }) => Promise<any>,
  form_id: string,
  control_id: string,
  options?: UploadOptions,
) => {
  try {
    if (!file_inline.file_id) {
      const config = await requestSendFile();
      file_inline.access_hash_send =
        config?.access_hash_send || config?.hash_file_request;
      file_inline.file_id = config.file_id;
      file_inline.dc_url = config?.upload_url || config?.server_url;
      file_inline.mime = getExt(file_inline.file_name);
    }

    if (options) {
      if (
        options.compressQuality !== undefined &&
        options.compressQuality !== null &&
        options.shouldCompress
      ) {
        let comporessedFile;
        try {
          comporessedFile = await compressAndResizeImage(
            file_inline.file_data,
            options.compressQuality,
            options.maxPixel,
          );
        } catch (error) {
          comporessedFile = file_inline.file_data;
        }
        file_inline.file_data = comporessedFile;
      }
    }

    const file = file_inline.file_data;
    const fileSize = file.size;
    const isBigFile = fileSize >= 10485760;
    const partSize = 128 * 1024;
    const totalParts = Math.ceil(fileSize / partSize);
    const activeDelta = 1;
    let canceled = false;
    let resolved = false;
    let doneParts = 0;
    let part = 0;

    // if (fileSize > Config.FileMaxSize) {
    //   return await Promise.reject("FILE_TOO_BIG");
    // }

    const errorHandler = (error: any) => {
      canceled = true;
      deferred.reject(error);
    };

    const deferred = new Deferred<any>();

    if (options) {
      options.cancel = (reason: any) => {
        if (!canceled && !resolved) {
          errorHandler("UPLOAD_CANCELED");
        }
      };
    }

    const resultInputFile = {
      _: isBigFile ? "inputFileBig" : "inputFile",
      id: file_inline.file_id,
      parts: totalParts,
      name: file.name,
      access_hash_rec: "",
    };

    options?.notify?.({
      file_id: file_inline.file_id,
      uploaded_size: 0,
      percent: 0,
      total_size: fileSize,
    });

    for (let offset = 0; offset < fileSize; offset += partSize) {
      // eslint-disable-next-line no-loop-func, @typescript-eslint/no-loop-func
      ((from: number, partNo: number) => {
        filePartRequest(
          "upload",
          async () => {
            try {
              const filePart = await getFilePart(file, from, partSize);
              if (canceled) {
                throw new Error("FAILED_AND_CANCELED");
              }
              // const auth = getCurrentUserFromStorage()?.auth || "";
              const result2 = await sendFile({
                headers: {
                  "Content-type": "application/json",
                  auth: "",
                  "access-hash-send": file_inline.access_hash_send,
                  "file-id": file_inline.file_id,
                  "part-number": (partNo + 1).toString(),
                  "total-part": totalParts.toString(),
                  form_id,
                  control_id,
                },
                data: filePart.result,
              });

              doneParts++;
              if (result2?.data && result2?.data.data.access_hash_rec) {
                resultInputFile.access_hash_rec =
                  result2.data.data.access_hash_rec;
              }
              if (doneParts >= totalParts) {
                options?.notify?.({
                  file_id: file_inline.file_id,
                  percent: 100,
                  total_size: fileSize,
                  uploaded_size: fileSize,
                  is_done: true,
                  blob: file_inline.file_data,
                });
                deferred.resolve(resultInputFile);
                resolved = true;
              } else {
                options?.notify?.({
                  file_id: file_inline.file_id,
                  uploaded_size: doneParts * partSize,
                  percent: Math.min(
                    100,
                    Math.floor((doneParts * partSize * 100) / (fileSize || 0)),
                  ),
                  total_size: fileSize,
                });
              }
            } catch (error) {
              // errorHandler('PART_FAILED');
              throw error;
            }
          },
          activeDelta,
        );
      })(offset, part++);
    }

    return await deferred.promise;
  } catch (exp) {
    throw exp;
  }
};

const filePartRequest = (
  requestKey: string,
  request: () => Promise<any>,
  activeDelta: number,
) => {
  if (requestPulls[requestKey] === undefined) {
    requestPulls[requestKey] = [];
    requestActives[requestKey] = 0;
  }
  const requestPull = requestPulls[requestKey];
  const deferred = new Deferred();

  requestPull.push({
    request,
    deferred,
    activeDelta,
  });

  setTimeout(() => {
    requestCheck(requestKey);
  });
  return deferred.promise;
};
// using
async function requestCheck(requestKey: string) {
  const requestPull = requestPulls[requestKey];
  const requestLimit = requestKey === "upload" ? 3 : 3;
  if (
    requestActives[requestKey] >= requestLimit ||
    !requestPull ||
    requestPull.length === 0
  ) {
    return false;
  }

  const requestInfo = requestPull.shift();
  const activeDelta = requestInfo.activeDelta || 1;
  requestActives[requestKey] += activeDelta;

  try {
    const result = await requestInfo.request();

    requestActives[requestKey] -= activeDelta;
    requestInfo.deferred.resolve(result);
    requestCheck(requestKey);
  } catch (error) {
    requestActives[requestKey] -= activeDelta;
    requestPull.push(requestInfo);
    //requestInfo.deferred.reject(error);
    requestCheck(requestKey);
  }
}

async function getFilePart(file: Blob, offset: number, partSize: number) {
  return new Promise<FileReader>((resolve, reject) => {
    const reader = new FileReader();
    const blob = file.slice(offset, offset + partSize);

    reader.onloadend = (e) => {
      const target: any = e.target;
      if (target.readyState !== FileReader.DONE) {
        return;
      }
      resolve(e.target as any);
    };
    reader.readAsArrayBuffer(blob);
  });
}

export const getExt = (name: string) => {
  const arr = name.split(".");
  return arr.length > 1 ? arr[arr.length - 1] : "";
};

export const getDimensions = (
  file: File,
): Promise<{ width: number; height: number }> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      const image = new Image();
      image.src = reader.result as string;
      image.onload = function () {
        resolve({ width: image.width, height: image.height });
      };
    };
    reader.onerror = function (error) {
      reject(error);
    };
  });

export const compressAndResizeImage = (
  file: File,
  compressQuality: number,
  maxPixel?: number,
): Promise<Blob> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      const img = new Image();
      img.src = reader.result as string;
      img.onload = function () {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (maxPixel) {
          canvas.width = maxPixel;
          canvas.height = maxPixel;
          ctx?.drawImage(img, 0, 0, maxPixel, maxPixel);
        } else {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx?.drawImage(img, 0, 0);
        }
        const compressedDataUrl = canvas.toDataURL(file.type, compressQuality);
        const compressedFile = dataURLtoFile(compressedDataUrl, file.name);
        resolve(compressedFile);
      };
    };
    reader.onerror = function (error) {
      reject(error);
    };
  });

function dataURLtoFile(dataURL: string, fileName: string): File {
  const byteString = atob(dataURL.split(",")[1]);
  const mimeString = dataURL.split(",")[0].split(":")[1].split(";")[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  const file = new File([ab], fileName, { type: mimeString });
  return file;
}

export const getDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    try {
      const reader = new FileReader();
      reader.onloadend = function () {
        resolve(reader.result as string);
      };
      reader.readAsDataURL(file);
    } catch (e) {
      return reject(e);
    }
  });
