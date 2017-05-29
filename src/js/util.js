function mergeInto(dest, obj) {
  for (const attr of obj) {
    dest[attr] = obj[attr];
  }
  return dest;
}

export { mergeInto };