import { highlightText } from "../functions";

export const setSections = (label, dataIndex, list) => {
  return { title: label, param: dataIndex, list: list };
};

export const setColumnItem = (
  label,
  dataIndex,
  keyword,
  customRender = null,
  isSort = true
) => {
  // 기본 객체 생성
  let column = {
    key: dataIndex,
    title: label,
    label: label,
    dataIndex: dataIndex,
    className: "text-xs",
    render: (text, record) => (
      <>
        {customRender !== null
          ? customRender(text, record)
          : highlightText(text, keyword)}
      </>
    ),
  };

  // isSort가 true일 경우에만 sorter 속성을 추가
  if (isSort) {
    column.sorter = (a, b) => a[dataIndex].localeCompare(b[dataIndex]);
  }

  return column;
};

export const setMenuItem = (disabled, label, icon, index, action, value) => {
  return {
    key: index.toString(),
    disabled: disabled,
    index: index,
    icon: icon,
    label: <span className="text-xs">{label}</span>,
    onClick: () => {
      action(value);
    },
  };
};
