function formatPhoneNumber(phoneNumber) {
  // 모든 "-"와 빈칸 제거
  let cleanNumber = phoneNumber.replace(/-|\s/g, "");
  if (cleanNumber.length < 7) {
    return phoneNumber;
  }
  // 휴대전화 번호 형식 확인 (010으로 시작하고 총 11자리)
  if (cleanNumber.startsWith("010") && cleanNumber.length === 11) {
    return (
      cleanNumber.substring(0, 3) +
      "-" +
      cleanNumber.substring(3, 7) +
      "-" +
      cleanNumber.substring(7)
    );
  }

  // 일반 전화번호 형식 (지역번호가 02인 경우와 그 외를 구분)
  else {
    // 서울 지역번호 (02)인 경우
    if (cleanNumber.startsWith("02")) {
      // 지역번호(2자리), 국번(3자리 또는 4자리), 고유번호(4자리)
      return (
        cleanNumber.substring(0, 2) +
        "-" +
        cleanNumber.substring(2, cleanNumber.length - 4) +
        "-" +
        cleanNumber.substring(cleanNumber.length - 4)
      );
    }
    // 그 외 지역번호인 경우
    else {
      // 지역번호(3자리), 국번(3자리 또는 4자리), 고유번호(4자리)
      return (
        cleanNumber.substring(0, 3) +
        "-" +
        cleanNumber.substring(3, cleanNumber.length - 4) +
        "-" +
        cleanNumber.substring(cleanNumber.length - 4)
      );
    }
  }
}

export const ConvertPhoneNumberByArray = (data = [], phoneFields = []) => {
  return data.map((item) => {
    const newItem = { ...item };
    phoneFields.forEach((field) => {
      // 해당 필드가 item에 존재하는지 확인
      if (item[field]) {
        // 존재한다면 포맷한 번호를 'Converted' 접미사와 함께 추가
        newItem[`${field}Converted`] = formatPhoneNumber(item[field]);
      } else {
        // 존재하지 않는다면 빈 문자열로 해당 필드와 'Converted' 필드를 모두 추가
        newItem[field] = ""; // 원본 필드에 빈 문자열 할당
        newItem[`${field}Converted`] = ""; // 변환된 필드에도 빈 문자열 할당
      }
    });
    return newItem;
  });
};
