export function wordCount(string: String) {
  if (!string) {
    return 0;
  }
  const matches = string.match(/[^\s]+/g);
  return matches ? matches.length : 0;
}
