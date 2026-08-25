export const isWithinDateRange = (
  dateValue: string | Date | null | undefined,
  from?: string | null,
  to?: string | null
): boolean => {
  if (!dateValue) return false;
  const date = new Date(dateValue);
  if (isNaN(date.getTime())) return false;

  if (from) {
    const fromDate = new Date(from);
    if (!isNaN(fromDate.getTime()) && date < fromDate) return false;
  }
  if (to) {
    const toDate = new Date(to);
    if (!isNaN(toDate.getTime())) {
      toDate.setHours(23, 59, 59, 999);
      if (date > toDate) return false;
    }
  }
  return true;
};
