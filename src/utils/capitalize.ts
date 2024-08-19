const capitalizeFirstLetter = (text: string) =>
  text.replace(/\b\w/g, (l) => l.toUpperCase())
export default capitalizeFirstLetter
