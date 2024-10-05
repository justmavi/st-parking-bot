export function format(str: string, ...args: any[]) {
  if (!args?.length) return str;

  return str.replace(/{(\d+)}/g, function (match, number) {
    return typeof args[number] != 'undefined' ? args[number] : match;
  });
}
