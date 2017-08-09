/**
 * Copyright (c) 2017-present A. Matías Quezada <amatiasq@gmail.com>
 */
// TODO

/**
 * Work in progres...
 */
export default function printJsx(value: any) {
  const {props: {children}} = value;
  const props = Object.keys(value.props)
    .filter(key => key !== 'children')
    .map(key => `${key}={${value.props[key]}}`);

  let tag = `<${value.type}`;

  if (props.length)
    tag += ` ${props.join(' ')}`;

  if (!children)
    return `${tag} />`;

  return `${tag}>{${children}}</${value.type}>`;
}
