export const extractCountryCode = (locode: string): string => {
  return locode.slice(0, 2).toLowerCase();
};

export const isValidLocode = (locode: string): boolean => {
  if (!locode) return false;
  return /^[A-Z]{2}[A-Z0-9]{3}$/.test(locode);
};