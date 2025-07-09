export const getStreakColor = (streak: number) => {
  if (streak >= 30) return 'text-purple-600 border-purple-600';
  if (streak >= 14) return 'text-blue-500 border-blue-500 bg-blue-500/10';
  if (streak >= 7) return 'text-green-600  border-green-600';
  if (streak >= 3) return 'text-orange-600 border-orange-600';
  return 'text-foreground border-foreground';
};