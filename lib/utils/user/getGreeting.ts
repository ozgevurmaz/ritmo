export const getGreetingKey = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "good-morning";
  if (hour < 17) return "good-afternoon";
  return "good-evening";
};