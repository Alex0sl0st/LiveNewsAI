export function normalizeKeys(obj) {
  const normalized = {};
  Object.keys(obj).forEach((key) => {
    normalized[key.toLowerCase()] = obj[key];
  });
  return normalized;
}
