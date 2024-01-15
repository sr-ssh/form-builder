export enum ValidationTypeEnum {
  Required = "Required",
  Regex = "Regex",
  Length = "Length",
  Range = "Range",
  Email = "Email",
  Url = "Url",
  Number = "Number",
  Persian = "Persian",
  Latin = "Latin",
  Mobile = "Mobile",
  PostalCode = "PostalCode",
  NationalId = "NationalId",
}

export type ValidationType = {
  type?: ValidationTypeEnum;
  regex_pattern?: string;
};
