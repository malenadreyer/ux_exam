export function capitalizeFirstLetter(string) {
  if (typeof string !== "string" || string.length === 0) {
    return string; // Return non-string or empty string as is
  }
  return string.charAt(0).toUpperCase() + string.slice(1);
}
