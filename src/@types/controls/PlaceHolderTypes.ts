export enum PlaceHolderTypeEnum {
  Start = "Start",
  End = "End",
  Note = "Note",
}

export type PlaceHolderType = {
  description?: string;
  type?: PlaceHolderTypeEnum;
  start_caption?: string;
  end_share_link?: boolean;
  end_refill_form?: boolean;
  refill_form_caption?: boolean;
};
