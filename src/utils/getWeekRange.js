export const getWeekRange = () => {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);

  const day = local.getDay(); // 0 = Sun
  const diff = local.getDate() - day + (day === 0 ? -6 : 1); // Monday start

  const weekStart = new Date(local.setDate(diff));
  weekStart.setHours(0, 0, 0, 0);

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 7);

  return {
    start: weekStart.toISOString().slice(0, 10),
    end: weekEnd.toISOString().slice(0, 10),
  };
};
