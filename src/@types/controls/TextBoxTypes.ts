export enum TextBoxTypeEnum {
  Text = "Text",
  Number = "Number",
  Email = "Email",
  Url = "Url",
  Persian = "Persian",
  Latin = "Latin",
  Mobile = "Mobile",
  PostalCode = "PostalCode",
  NationalId = "NationalId",
}

export type TextBoxType = {
  type?: TextBoxTypeEnum;
};
