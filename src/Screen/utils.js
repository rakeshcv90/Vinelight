export const getDatesForMultipleDaysOverMonths = (
  startDateStr,
  dayNames,
  monthsAhead = 3,
) => {
  const weekdays = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };

  const targetDays = dayNames.map(day => weekdays[day]);
  const startDate = parseLocalDate(startDateStr); // ✅ LOCAL DATE
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

// ⬅️ Make sure this is included too:
const parseLocalDate = dateStr => {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
};

export const isSubscriptionValid = subscription => {
  return (
    Array.isArray(subscription) &&
    subscription.length > 0 &&
    subscription[0]?.subscriptionStatus === 'Active'
  );
};
export const isCoupanValid = details => {

  
  return (
    Array.isArray(details) &&
    details.length > 0 &&
    details[0]?.status === 'Active'
  );
};
