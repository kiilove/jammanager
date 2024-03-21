import dayjs from "dayjs";

export const GenerateDocumentID = ({
  personalNumber = 0,
  dateString = dayjs(new Date()).format("YYYYMMDD"),
  familyString = "",
  beforeString = "",
  afterString = "",
  extraString = "",
}) => {
  const before = beforeString === "" ? "" : `${beforeString}-`;
  const after = afterString === "" ? "" : `${afterString}-`;
  const extra = extraString === "" ? "" : `${extraString}-`;
  const family = familyString === "" ? `${dateString}-` : `${familyString}-`;
  const personal = (personalNumber + 1).toString().padStart(4, "0");

  const documentID = before + extra + family + personal + after;

  return documentID;
};
