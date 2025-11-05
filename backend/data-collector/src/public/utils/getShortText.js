export function getShortText(text, maxLength = 70) {
  const shortText =
    text.length > maxLength ? text.substring(0, maxLength) + "..." : text;

  return shortText;
}
