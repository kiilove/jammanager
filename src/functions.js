import dayjs from "dayjs";
import { v4 as uuidv4 } from "uuid";
import CryptoJS from "crypto-js";
import { isArray } from "lodash";

export const encryptData = (data, secretKey) => {
  return CryptoJS.AES.encrypt(data, secretKey).toString();
};

export const decryptData = (ciphertext, secretKey) => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
  return bytes.toString(CryptoJS.enc.Utf8);
};

export const encryptObject = (data = {}, secretKey) => {
  if (!data || !secretKey) {
    return;
  }

  if (isArray(data)) {
    return;
  }
  const newData = { ...data };
  Object.keys(newData).map((key) => {
    const newValue =
      newData[key] !== "" ? encryptData(newData[key], secretKey) : "";

    newData[key] = newValue;
  });

  return newData;
};

export const decryptObject = (data = {}, secretKey) => {
  if (!data || !secretKey) {
    return;
  }

  if (isArray(data)) {
    return;
  }
  const newData = { ...data };
  Object.keys(newData).map((key) => {
    const newValue =
      newData[key] !== "" ? decryptData(newData[key], secretKey) : "";

    newData[key] = newValue;
  });

  return newData;
};

export const trimObjectValue = (data = {}) => {
  if (!data) {
    return;
  }
  let newData = { ...data };
  Object.keys(newData).map((key) => {
    const newValue = newData[key] ? newData[key].trim() : "";
    newData[key] = newValue;
  });
  return newData;
};

export const generateToken = () => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let token = "";
  for (let i = 0; i < 8; i++) {
    token += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return token;
};
export const groupByKey = (list, key) => {
  return list.reduce((acc, item) => {
    if (!acc.some((accItem) => accItem.value === item[key])) {
      acc.push({ value: item[key], label: item[key] });
    }
    return acc;
  }, []);
};

export const generateUUID = () => {
  const uuid = uuidv4();
  return uuid;
};

export const generateToday = () => {
  const currentDateTime = dayjs().format("YYYY-MM-DD HH:mm");
  return currentDateTime;
};

export const generateFileName = (
  originalFilename,
  newFileName,
  fileCount = 0
) => {
  if (!originalFilename) {
    return;
  } else {
    const fileExtension = originalFilename.split(".").pop();

    return `${newFileName}[${fileCount}].${fileExtension}`;
  }
};

export const handleCategoriesWithGrades = (categories, grades) => {
  let dummy = [];

  categories

    .sort((a, b) => a.contestCategoryIndex - b.contestCategoryIndex)
    .map((category, cIdx) => {
      const matchedGrades = grades
        .filter((grade) => grade.refCategoryId === category.contestCategoryId)
        .sort((a, b) => a.contestGradeIndex - b.contestGradeIndex);
      const newCategoryItem = { ...category, grades: [...matchedGrades] };
      dummy.push({ ...newCategoryItem });
    });

  return dummy;
};

export function getRandomNumber(min, max) {
  // min과 max 사이의 임의의 소수를 얻고, 그 소수를 min과 max 사이의 범위로 변환합니다.
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const handleArrayEdit = (originalArray, newValue, keyName, keyValue) => {
  const newArray = [...originalArray];
  const arrayIndex = newArray.findIndex((f) => f[keyName] === keyValue);

  if (arrayIndex != -1) {
    newArray.splice(arrayIndex, 1, newValue);
  }
  return newArray;
};

export function formatPhoneNumber(phoneNumber) {
  // 모든 "-"와 빈칸 제거
  let cleanNumber = phoneNumber.replace(/-|\s/g, "");
  if (cleanNumber.length < 7) {
    return;
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

export const handlePhoneNumber = (ref, fieldName, value) => {
  ref?.current.setFieldsValue({
    ...ref?.current.getFieldsValue(),
    [fieldName]: formatPhoneNumber(value),
  });
};

export const NumberWithComma = (value) => {
  const numberValue = value.replace(/\D/g, "");
  return numberValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const removeCommas = (value) => {
  return parseInt(value.replace(/,/g, ""), 10);
};

export const calcDepreciation = (type, rate, originalPrice, fromDate) => {
  const fromDateObj = new Date(fromDate.seconds * 1000);
  const toDateObj = new Date();
  const monthsDiff = Math.ceil(
    (toDateObj - fromDateObj) / (1000 * 60 * 60 * 24 * 30)
  );

  let depreciationValue = 0;
  let residualValue = originalPrice;

  if (type === "정액법") {
    const yearlyDepreciation = 100 / rate;
    const monthlyDepreciation = originalPrice * (yearlyDepreciation / 12 / 100);
    depreciationValue = monthlyDepreciation * Math.floor(monthsDiff);
    residualValue -= depreciationValue;
  } else if (type === "정률법") {
    for (let i = 0; i < Math.floor(monthsDiff / 12); i++) {
      const annualDepreciation = residualValue * (rate / 100);
      residualValue -= annualDepreciation;
    }
    depreciationValue = originalPrice - residualValue;
  }

  residualValue = residualValue <= 1000 ? 1000 : residualValue;

  return {
    depreciationValue: parseFloat(depreciationValue.toFixed(2)),
    residualValue: parseFloat(residualValue.toFixed(2)),
    monthsDiffValue: parseInt(monthsDiff),
  };
};

export const highlightText = (text, searchKeyword) => {
  if (!searchKeyword.trim()) {
    return text;
  }

  const parts = text.split(new RegExp(`(${searchKeyword})`, "gi"));
  return parts.map((part, index) =>
    part.toLowerCase() === searchKeyword.toLowerCase() ? (
      <span
        key={index}
        style={{
          backgroundColor: "rgb(34, 197, 94)",
          color: "white",
        }}
      >
        {part}
      </span>
    ) : (
      part
    )
  );
};

export const generateUniqueCompanyID = (existingNumbers) => {
  const generateRandomNumber = () => {
    let randomNumber = "";
    for (let i = 0; i < 10; i++) {
      randomNumber += Math.floor(Math.random() * 10).toString(); // 0부터 9까지의 숫자를 랜덤하게 생성하여 문자열로 추가
    }
    return randomNumber;
  };

  let uniqueNumber = generateRandomNumber();
  while (existingNumbers.includes(uniqueNumber)) {
    uniqueNumber = generateRandomNumber(); // 기존 번호에 포함되어 있으면 새로운 번호 생성
  }

  return uniqueNumber;
};
