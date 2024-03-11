import dayjs from "dayjs";

export const GenerateDocumentID = ({
  personalNumber = 0,
  familyString = "",
  beforeString = "",
  afterString = "",
  extraString = "",
}) => {
  const before = beforeString === "" ? "" : `${beforeString}-`;
  const after = afterString === "" ? "" : `${afterString}-`;
  const extra = extraString === "" ? "" : `${extraString}-`;
  const family =
    familyString === ""
      ? `${dayjs(new Date()).format("YYYY-MM-DD")}-`
      : `${familyString}-`;
  const personal = (personalNumber + 1).toString().padStart(4, "0");

  const documentID = before + family + extra + personal + after;

  return documentID;
};
