const convertToTitleCase = (string: string) => {
  const list = string.split(' ');
  const titleCased = list.map((chunk) => {
    return chunk.charAt(0).toUpperCase() + chunk.slice(1).toLowerCase();
  });
  return titleCased.join(' ');
};

export default convertToTitleCase;
