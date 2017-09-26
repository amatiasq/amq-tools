import round from '../../../src/util/math/round';


describe('round helper', () => {

  it('should round with two decimals by default', () => {
    expectDecimals(round(Math.PI), 2);
  });

  it('should round to integer if 0 decimals are requested', () => {
    expectDecimals(round(Math.PI, 0), 0);
  });

  it('should round to 3 decimals if requested', () => {
    expectDecimals(round(Math.PI, 3), 3);
  });

  it('should warn when trying to round NaN', () => {
    const restore = mockWarn();
    round(NaN);
    expect(console.warn).toHaveBeenCalled();
    restore();
  });


  describe('#curry method', () => {
    it('should return a function', () => {
      expect(round.curry(0)).toBeInstanceOf(Function);
    });

    it('should round to integer if 0 decimals are requested', () => {
      expectDecimals(round.curry(0)(Math.PI), 0)
    });

    it('should round to 3 decimals if requested', () => {
      expectDecimals(round.curry(3)(Math.PI), 3)
    });

    it('should wanr when trying to round NaN', () => {
      const restore = mockWarn();
      round.curry(0)(NaN);
      expect(console.warn).toHaveBeenCalled();
      restore();
    });
  });
});


function expectDecimals(value: number, decimals: number): void {


  expect(countDecimals(value)).toBe(decimals);
}


function countDecimals(value: number): number {
  let modified = value;
  let decimals = 0;

  while (Math.round(modified) !== modified) {
    modified *= 10;
    decimals++;
  }

  return decimals;
}


function mockWarn() {
  const original = console.warn;
  console.warn = jest.fn();
  return () => console.warn = original;
}
