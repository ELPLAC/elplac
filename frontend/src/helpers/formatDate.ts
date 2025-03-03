export const formatDate = (date: Date | string | undefined): string => {
  if (!date) return "-";

  const parsedDate = typeof date === "string" ? new Date(date) : date;

  if (!(parsedDate instanceof Date) || isNaN(parsedDate.getTime())) {
    return "-";
  }

  const year = parsedDate.getFullYear();
  const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
  const day = String(parsedDate.getDate()).padStart(2, "0");

  return `${day}-${month}-${year}`;
};
