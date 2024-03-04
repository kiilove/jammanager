const groupByKey = (list, key) => {
  return list.reduce((acc, item) => {
    // 값이 있고, 빈 문자열이 아닌 경우에만 포함시킵니다.
    if (item[key] && !acc.some((accItem) => accItem.value === item[key])) {
      acc.push({ value: item[key], label: item[key] });
    }
    return acc;
  }, []);
};

export const FilterKeyByArray = (data = [], groupKeys = []) => {
  const groupedData = {};

  groupKeys.forEach((groupKey) => {
    const groupedByKey = groupByKey(
      data.filter((item) => item[groupKey]),
      groupKey
    ).filter((g) => g.value && g.label); // value와 label이 빈값이 아닌 항목만 필터링

    groupedData[`${groupKey}Grouped`] = groupedByKey;
  });

  return groupedData;
};
