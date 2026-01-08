export const getTodayDate = () => {
  const now = new Date();
  now.setMinutes(now.getMinutes() + now.getTimezoneOffset() * -1);
  return now.toISOString().split("T")[0];
};
