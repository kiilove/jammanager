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
