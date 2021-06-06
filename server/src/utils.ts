export function splitFileName(name: string) {
  const index = name.lastIndexOf(".");
  return [name.slice(0, index), name.slice(index + 1)];
}
