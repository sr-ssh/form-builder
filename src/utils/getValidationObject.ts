import { ValidationTypeEnum } from "../@types/ValidationTypes";
import { ControlType, ControlTypeEnum } from "../@types/controls/ControlTypes";
import { FieldValues, RegisterOptions } from "react-hook-form";
import { convertLocale } from "../hooks/useGlobalLocales";

export const getValidationObject = (
  control: ControlType,
  requiredAnswer?: boolean,
) => {
  const validationObj: RegisterOptions<FieldValues, string> = {};
  const validation = control.validations;
  const maxSize = control.file_upload_info?.max_size;
  if (control.type === ControlTypeEnum.FileUpload && maxSize) {
    validationObj.validate = {
      maxSize: (files) => {
        if (files?.[0] && files?.[0]?.size > maxSize * 1000) {
          return convertLocale("VALIDATION_FILE_SIZE");
        }
        return true;
      },
    };
  }
  validation?.forEach((item) => {
    let regex: RegExp = /^/;
    if (item.regex_pattern) {
      const regexPattern = item.regex_pattern.slice(1, -1);
      regex = new RegExp(regexPattern);
    }
    switch (item.type) {
      case ValidationTypeEnum.Regex:
        validationObj.pattern = {
          value: regex,
          message: convertLocale("VALIDATION_REGEX"),
        };
        break;
      case ValidationTypeEnum.Email:
        validationObj.pattern = {
          value: regex,
          message: convertLocale("VALIDATION_EMAIL"),
        };
        break;
      case ValidationTypeEnum.Length:
        validationObj.pattern = {
          value: regex,
          message: convertLocale("VALIDATION_LENGTH"),
        };
        break;
      case ValidationTypeEnum.Number:
        validationObj.pattern = {
          value: regex,
          message: convertLocale("VALIDATION_NUMBER"),
        };
        break;
      case ValidationTypeEnum.Range:
        validationObj.pattern = {
          value: regex,
          message: convertLocale("VALIDATION_RANGE"),
        };
        break;
      case ValidationTypeEnum.Url:
        validationObj.pattern = {
          value: regex,
          message: convertLocale("VALIDATION_URL"),
        };
        break;
      case ValidationTypeEnum.Required:
        validationObj.required = convertLocale("VALIDATION_REQUIRED");
        break;
      case ValidationTypeEnum.Latin:
        validationObj.pattern = {
          value: regex,
          message: convertLocale("VALIDATION_LATIN"),
        };
        break;
      case ValidationTypeEnum.Mobile:
        validationObj.pattern = {
          value: regex,
          message: convertLocale("VALIDATION_MOBILE"),
        };
        break;
      case ValidationTypeEnum.NationalId:
        validationObj.pattern = {
          value: regex,
          message: convertLocale("VALIDATION_NATIONAL_ID"),
        };
        break;
      case ValidationTypeEnum.Persian:
        validationObj.pattern = {
          value: regex,
          message: convertLocale("VALIDATION_PERSIAN"),
        };
        break;
      case ValidationTypeEnum.PostalCode:
        validationObj.pattern = {
          value: regex,
          message: convertLocale("VALIDATION_POSTAL_CODE"),
        };
        break;
      default:
        validationObj.required = convertLocale("VALIDATION_REGEX");
        break;
    }
  });
  if (requiredAnswer) {
    validationObj.required = convertLocale("VALIDATION_REQUIRED");
  }
  return validationObj;
};
