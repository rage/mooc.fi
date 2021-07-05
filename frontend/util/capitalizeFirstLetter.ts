export default function capitalizeFirstLetter<T extends String>(
  string: T,
): Capitalize<T> {
  return (string.charAt(0).toUpperCase() + string.slice(1)) as Capitalize<T>
}
