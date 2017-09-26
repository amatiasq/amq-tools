// const DEFAULT_DECIMALS = 2;
// const DEFAULT_OPERATOR = Math.pow(10, DEFAULT_DECIMALS);

const toExport = round as Round;
toExport.curry = curry;

export default toExport;


function round(value: number, decimals = 2): number {
  return internalRound(value, Math.pow(10, decimals));
}


function curry(decimals: number) {
  const operator = Math.pow(10, decimals);

  return (value: number) => internalRound(value, operator);
}


function internalRound(value: number, operator: number) {
  if (Number.isNaN(value)) {
    console.warn('[amq-tools/util/math/round] Rounding NaN');
  }

  return Math.round(value * operator) / operator;
}


type Round = typeof round & {curry: typeof curry};
