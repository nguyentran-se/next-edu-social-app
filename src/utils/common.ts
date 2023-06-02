export function getValueByPath(obj: Object, path: string) {
  const paths = path.split('.');
  let res = obj as Object;

  for (const p of paths) {
    res = res[p as keyof typeof res];
  }

  return res;
}
export function capitalizeAndOmitUnderscore(str: string) {
  if (!str) return '';
  return str
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

export function removeAccents(str: string) {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
}
