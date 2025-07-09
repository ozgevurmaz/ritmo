type FormatOptions = {
  weekday?: 'long' | 'short' | 'narrow' | false;
  day?: 'numeric' | '2-digit' | false;
  month?: 'long' | 'short' | '2-digit' | 'numeric' | false;
  year?: 'numeric' | '2-digit' | false;
  locale?: string;
};

export const formatDate = (
  date: Date,
  {
    weekday = false,
    day = '2-digit',
    month = 'short',
    year = '2-digit',
    locale = 'en-GB',
  }: FormatOptions = {}
): string => {
  const options: Intl.DateTimeFormatOptions = {};

  if (weekday) options.weekday = weekday;
  if (day) options.day = day;
  if (month) options.month = month;
  if (year) options.year = year;

  return date.toLocaleDateString(locale, options);
};

export const formatDateForQuery = (date: Date) => date.toISOString().split("T")[0];

export const formatSupabaseDate = (dateString?: string) => {
  if (!dateString) return 'Never';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
