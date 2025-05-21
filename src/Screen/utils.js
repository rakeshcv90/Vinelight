export const getDatesForMultipleDaysOverMonths = (startDateStr, dayNames, monthsAhead = 3) => {
  const weekdays = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6
  };

  const targetDays = dayNames.map(day => weekdays[day]);
  const startDate = new Date(startDateStr);
  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + monthsAhead);

  const result = [];

  let current = new Date(startDate);
  while (current <= endDate) {
    if (targetDays.includes(current.getDay())) {
      const yyyy = current.getFullYear();
      const mm = String(current.getMonth() + 1).padStart(2, '0');
      const dd = String(current.getDate()).padStart(2, '0');
      result.push(`${yyyy}-${mm}-${dd}`);
    }
    current.setDate(current.getDate() + 1);
  }

  return result;
};
