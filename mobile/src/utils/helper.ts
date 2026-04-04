export const getNextDays = (count: number) => {
  const days = [];
  for (let i = 0; i < count; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    const localFullDate = `${year}-${month}-${day}`;

    days.push({
      fullDate: localFullDate,
      dayName: date.toLocaleDateString("en-IN", { weekday: "short" }),
      dayNumber: date.getDate(),
    });
  }
  return days;
};
