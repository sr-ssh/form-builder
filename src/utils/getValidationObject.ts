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
      const regexPattern = item.regex_pattern;
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
          value: item.regex_pattern ? regex : /^[\w.-]+@[\w.-]+\.\w+$/,
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
          value: item.regex_pattern ? regex : /^-?\d+(\.\d+)?$/,
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
          value: item.regex_pattern
            ? regex
            : /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/,
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
          value: item.regex_pattern ? regex : /^\d{10,12}$/,
          message: convertLocale("VALIDATION_MOBILE"),
        };
        break;
      case ValidationTypeEnum.NationalId:
        if (item.regex_pattern) {
          validationObj.pattern = {
            value: regex,
            message: convertLocale("VALIDATION_NATIONAL_ID"),
          };
        } else {
          validationObj.validate = (value) => {
            const validated = validateNationalCode(value);
            if (validated) return true;
            return convertLocale("VALIDATION_NATIONAL_ID");
          };
        }
        break;
      case ValidationTypeEnum.Persian:
        validationObj.pattern = {
          value: regex,
          message: convertLocale("VALIDATION_PERSIAN"),
        };
        break;
      case ValidationTypeEnum.PostalCode:
        validationObj.pattern = {
          value: item.regex_pattern ? regex : /^\d{10}$/,
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

const validateNationalCode = (code: string) => {
  var L = code.length;

  if (L < 8 || parseInt(code, 10) === 0) return false;
  code = ("0000" + code).substr(L + 4 - 10);
  if (parseInt(code.substr(3, 6), 10) === 0) return false;
  var c = parseInt(code.substr(9, 1), 10);
  var s = 0;
  for (var i = 0; i < 9; i++) s += parseInt(code.substr(i, 1), 10) * (10 - i);
  s = s % 11;
  return (s < 2 && c === s) || (s >= 2 && c === 11 - s);
};
