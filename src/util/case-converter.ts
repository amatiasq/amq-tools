/**
 * Copyright (c) 2017-present A. Matías Quezada <amatiasq@gmail.com>
 */
const cases = {

  CAMEL_CASE: {
    detector: /^[a-z][a-zA-Z]*$/,
    from(text: string) {
      return text
        .replace(/[a-z][A-Z]/g, word => ` ${word}`)
        .toLowerCase()
        .split(' ');
    },
    to(text: string[]) {
      return text
        .join(' ')
        .replace(/ [a-z]/g, word => word[1].toUpperCase());
    },
  },

  UPPER_CASE: {
    detector: /^[A-Z_]+$/,
    from(text: string) {
      return text.toLowerCase().split('_');
    },
    to(text: string[]) {
      return text.join('_').toUpperCase();
    },
  },

  PASCAL_CASE: {
    detector: /^[A-Z][a-zA-Z]*$/,
    from(text: string) {
      return cases.CAMEL_CASE.from(text);
    },
    to(text: string[]) {
      const camel = cases.CAMEL_CASE.to(text);
      return camel[0].toUpperCase() + camel.substr(1);
    },
  },

  DASH: {
    detector: /^[a-z]+-[a-z-]+$/,
    from(text: string) {
      return text.split('-');
    },
    to(text: string[]) {
      return text.join('-');
    },
  },
};

const types = Object.keys(cases);


/**
 * Transforms a identifier between different cases.
 */
export default function caseConverter(value: string, output: Type) {
  const sourceName = types.find(key => cases[key].detector.test(value));
  const source = cases[sourceName];
  const dest = cases[output];

  return dest.to(source.from(value));
}


export type Type = 'CAMEL_CASE' | 'PASCAL_CASE' | 'UPPER_CASE';
type Conversor = (text: string, find: RegExp) => string;
