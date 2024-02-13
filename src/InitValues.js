export const initUserStatus = ["재직", "파견", "휴직", "퇴사"];
export const initUserJob = [
  "정직원",
  "계약직",
  "임시직",
  "프리랜서",
  "외부직원",
];
export const initCategory = [
  {
    key: 1,
    name: "전산장비",
    depreciationType: "설정안함",
    depreciationPeriod: 0,
    productLine: [
      "데스크탑",
      "노트북",
      "모니터",
      "프린터",
      "태블릿",
      "TV",
      "냉장고",
      "스타일러",
      "커피머신",
      "세탁기",
      "건조기",
      "안마의자",
    ],
  },
  {
    key: 2,
    name: "소프트웨어",
    depreciationType: "설정안함",
    depreciationPeriod: 0,
    productLine: ["라이선스", "구독"],
  },
  {
    key: 3,
    name: "가구",
    depreciationType: "설정안함",
    depreciationPeriod: 0,
    productLine: [
      "사무용책상",
      "사무용의자",
      "회의용테이블",
      "회의용의자",
      "싱크대",
      "장식장",
    ],
  },
  {
    key: 4,
    name: "차량",
    depreciationType: "설정안함",
    depreciationPeriod: 0,
    productLine: ["승용", "승합", "화물"],
  },
  { key: 5, name: "기타", depreciationType: "설정안함", depreciationPeriod: 0 },
];

export const initDescription = [
  {
    key: 1,
    productLine: "데스크탑",
    descritpionItem: [
      { keyName: "프로세서", valueType: "autoComplete" },
      { keyName: "메모리", valueType: "autoComplete" },
      { keyName: "메인보드", valueType: "autoComplete" },
      { keyName: "운영체제", valueType: "autoComplete" },
      { keyName: "크기(W×D×H)", valueType: "textSize" },
      { keyName: "비고", valueType: "textArea" },
    ],
  },
];

export const initDepreciationType = [
  { key: "정액법", value: "정액법" },
  { key: "정률법", value: "정률법" },
  { key: "설정안함", value: "설정안함" },
];

export const initDepreciationPeriod = [
  { key: "5년", value: 5, label: "5년" },
  {
    key: "10년",
    value: 10,
    label: "10년",
  },
  { key: "6년", value: 6, label: "6년" },
  { key: "7년", value: 7, label: "7년" },
  { key: "8년", value: 8, label: "8년" },
  { key: "9년", value: 9, label: "9년" },
  {
    key: "설정안함",
    value: 0,
    label: "설정안함",
  },
];
export const initDepreciationRate = [
  { key: "50%", value: 50, label: "50%" },
  { key: "10%", value: 10, label: "10%" },
  { key: "20%", value: 20, label: "20%" },
  { key: "30%", value: 30, label: "30%" },
  { key: "40%", value: 40, label: "40%" },
  {
    key: "설정안함",
    value: 0,
    label: "설정안함",
  },
];

export const assetInfoFieldName = [
  {
    keyName: "id",
    label: "일련번호",
    index: 0,
    hidden: true,
    type: "시스템",
  },
  {
    keyName: "firstPics",
    label: "최초사진",
    index: 1,
    hidden: false,
    type: "자산",
    span: 1,
  },
  {
    keyName: "assetCode",
    label: "자산코드",
    index: 0,
    hidden: false,
    type: "타이틀",
  },
  {
    keyName: "assetCategory",
    label: "분류",
    index: 3,
    hidden: false,
    type: "자산",
  },
  {
    keyName: "assetProductLine",
    label: "품목",
    index: 5,
    hidden: false,
    type: "자산",
  },
  {
    keyName: "assetVendor",
    label: "제조사",
    index: 7,
    hidden: false,
    type: "자산",
  },
  {
    keyName: "assetModel",
    label: "모델명",
    index: 9,
    hidden: false,
    type: "자산",
  },
  {
    keyName: "assetName",
    label: "자산명",
    index: 11,
    hidden: false,
    type: "자산",
  },
  {
    keyName: "assetOwnerCompany",
    label: "자산소유사",
    index: 13,
    hidden: false,
    type: "자산",
  },
  {
    keyName: "assetPurchaseName",
    label: "매입처",
    index: 15,
    hidden: false,
    type: "거래",
  },
  {
    keyName: "assetPurchasedDate",
    label: "구입일자",
    index: 17,
    hidden: false,
    type: "거래",
  },
  {
    keyName: "createdAt",
    label: "등록일자",
    index: 19,
    hidden: false,
    type: "거래",
  },
  {
    keyName: "assetCost",
    label: "취득원가",
    index: 21,
    hidden: false,
    type: "거래",
  },
  {
    keyName: "assetDepreciationType",
    label: "감가방식",
    index: 17,
    hidden: false,
    type: "거래",
  },
  {
    keyName: "assetDepreciationPeroid",
    label: "감가기간(율)",
    index: 19,
    hidden: false,
    type: "거래",
  },
  {
    keyName: "userInfo",
    label: "사용자",
    index: 29,
    hidden: false,
    type: "사용자",
  },
  {
    keyName: "location",
    label: "장소",
    index: 31,
    hidden: false,
    type: "사용자",
  },
  {
    keyName: "assetOwner",
    label: "등록ID",
    index: 33,
    hidden: true,
    type: "시스템",
  },
];
