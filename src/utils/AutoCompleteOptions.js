export const updateGrouped = (condition, key, value) => {
  if (condition?.length === 0) {
    setGrouped((prevGrouped) => ({
      ...prevGrouped,
      [key]: [...prevGrouped[key], { value, label: value }],
    }));
  }
};
