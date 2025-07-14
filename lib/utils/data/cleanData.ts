export const cleanData = (data: Record<string, any>) => {
  return Object.fromEntries(
    Object.entries(data).filter(([_, v]) => v !== null && v !== undefined && v !== "")
  );
};