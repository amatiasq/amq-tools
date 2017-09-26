import Vector, { IVector } from '../src/vector';


describe('Vector component', () => {
  const zero = new Vector(0, 0);
  const first = new Vector(1, 1);
  const square = new Vector(2, 2);
  const rectangle = new Vector(3, 5);


  it('should contain x and y values passed to the constructor', () => {
    expect(zero.x).toBe(0);
    expect(zero.y).toBe(0);
    expect(first.x).toBe(1);
    expect(first.y).toBe(1);
    expect(square.x).toBe(2);
    expect(square.y).toBe(2);
    expect(rectangle.x).toBe(3);
    expect(rectangle.y).toBe(5);
  });


  [ zero, first, square, rectangle ].forEach(vector => {
    describe(`for vector ${vector}`, () => {

      describe('#map method', () => {
        testImmutability(vector, () => vector.map(Math.round));

        it('should ivoke the callback once per property', () => {
          const spy = jest.fn();

          vector.map(spy);

          expect(spy).toHaveBeenCalledTimes(2);
          expect(spy).toBeCalledWith(vector.x, 'x', vector);
          expect(spy).toBeCalledWith(vector.y, 'y', vector);
        });

        it('should return a new vector with the values returned by the callback', () => {
          const expected = { x: -10, y: -15 };
          expect(vector.map((value, key) => expected[key]))
            .toEqual(expected);
        });
      });


      describe('#is method', () => {
        it('should throw error if null passed', () => expect(() => vector.is(null)).toThrow());
        it('should return true for itself', () => expect(vector.is(vector)).toBe(true));

        it('should return true if the arguments conicide with the vector values', () => {
          expect(vector.is({ x: vector.x })).toBe(true);
          expect(vector.is({ y: vector.y })).toBe(true);
          expect(vector.is({ x: vector.x, y: vector.y })).toBe(true);
        });

        it('should return false if the arguments differ with the vector values', () => {
          expect(vector.is({ x: vector.x + 1 })).toBe(false);
          expect(vector.is({ y: vector.y + 1 })).toBe(false);
          expect(vector.is({ x: vector.x + 1, y: vector.y })).toBe(false);
          expect(vector.is({ x: vector.x, y: vector.y + 1 })).toBe(false);
          expect(vector.is({ x: vector.x + 1, y: vector.y + 1 })).toBe(false);
        });
      });


      describe('#isValue method', () => {
        it('should return true if both values coincide', () => {
          expect(vector.isValue(vector.x, vector.y)).toBe(true);
        });

        if (vector.x === vector.y) {
          it('should return true if a single value is passed and is equal to both vector values', () => {
            expect(vector.isValue(vector.x)).toBe(true);
          });
        } else {
          it('should return false if a single value is passed and some differ from vector values', () => {
            expect(vector.isValue(vector.x)).toBe(false);
          });
        }

        it('should return false for other values', () => {
          expect(vector.isValue(vector.x + 1)).toBe(false);
          expect(vector.isValue(vector.x + 1, vector.y)).toBe(false);
          expect(vector.isValue(vector.x, vector.y + 1)).toBe(false);
          expect(vector.isValue(vector.x + 1, vector.y + 1)).toBe(false);
        });
      });


      describe('#set method', () => {
        testImmutability(vector, () => vector.set({ x: -1, y: -1 }));

        describe('when setting x', () => {
          it('should return a new vector with the passed value and it\'s y value', () => {
            expect(vector.set({ x: -1 })).toEqual({ x: -1, y: vector.y });
          });
        });

        describe('when setting y', () => {
          it('should return a new vector with the passed value and it\'s x value', () => {
            expect(vector.set({ y: -1 })).toEqual({ x: vector.x, y: -1 });
          });
        });
      });

      testOperator('add', vector, (value, modifier) => value + modifier);
      testOperator('sustract', vector, (value, modifier) => value - modifier);
      testOperator('multiply', vector, (value, modifier) => value * modifier);
      testOperator('divide', vector, (value, modifier) => value / modifier);
    });


    testEverySome('every', vector);
    testEverySome('some', vector);


    describe('#toString method', () => {
      it('should contain both vector values', () => {
        expect(vector.toString()).toContain(vector.x);
        expect(vector.toString()).toContain(vector.y);
      });
    });


    describe('#toArray method', () => {
      it('should contain both vector values', () => {
        expect(vector.toArray()).toEqual([ vector.x, vector.y ]);
      });
    });


    describe('#toObject method', () => {
      it('should contain both vector values', () => {
        expect(vector.toObject()).toEqual({ x: vector.x, y: vector.y });
      });
    });


    describe('#toJSON method', () => {
      it('should contain both vector values', () => {
        expect(vector.toJSON()).toBe(`{x:${vector.x},y:${vector.y}}`);
      });
    });
  });
});


function testOperator(
  method: string,
  vector: IVector,
  operator: (value: number, modifier: number) => number
) {
  const methodValue = `${method}Value`;
  const operand = 0.5;

  describe(`#${method} method`, () => {
    testImmutability(vector, () => vector[method]({ x: operand, y: operand }));

    describe('when passing to x', () => {
      it('should return a vector with same y but operated x', () => {
        expect(vector[method]({ x: operand })).toEqual({
          x: operator(vector.x, operand),
          y: vector.y,
        });
      });
    });

    describe('when passing to y', () => {
      it('should return a vector with same x but operated y', () => {
        expect(vector[method]({ y: operand })).toEqual({
          x: vector.x,
          y: operator(vector.y, operand),
        });
      });
    });

    describe('when passing both', () => {
      it('should operate the vector values with the passed values', () => {
        expect(vector[method]({ x: operand, y: operand })).toEqual({
          x: operator(vector.x, operand),
          y: operator(vector.y, operand),
        });
      });
    });

    describe('when pasing a vector', () => {
      it('should operate values of both vectors', () => {
        expect(vector[method](vector)).toEqual({
          x: operator(vector.x, vector.x),
          y: operator(vector.y, vector.y),
        });
      });
    });
  });


  describe(`#${methodValue} method`, () => {
    testImmutability(vector, () => vector[methodValue](operand));

    describe('when passing a single value', () => {
      it('should operate that value to each vector property', () => {
        expect(vector[methodValue](operand)).toEqual({
          x: operator(vector.x, operand),
          y: operator(vector.y, operand),
        });
      });
    });

    describe('when passing two values', () => {
      it('should operate the first value to the x property and the second value to the y property', () => {
        expect(vector[methodValue](operand, operand)).toEqual({
          x: operator(vector.x, operand),
          y: operator(vector.y, operand),
        });
      });
    });
  });
}


function testEverySome(name: string, vector: IVector) {
  const value = name === 'every';
  const opposite = !value;

  describe(`#${name} method`, () => {
    testImmutability(vector, () => vector[name](() => value));


    it('should receive the vector values, the key and the vector object', () => {
      const spy = jest.fn().mockReturnValue(value);
      vector[name](spy);
      expect(spy).toBeCalledWith(vector.x, 'x', vector);
      expect(spy).toBeCalledWith(vector.y, 'y', vector);
    });


    describe(`if the callback always returns ${value}`, () => {
      it('should be called twice', () => {
        const spy = jest.fn().mockReturnValue(value);
        vector[name](spy);
        expect(spy).toHaveBeenCalledTimes(2);
      });


      it(`should return ${value}`, () => {
        expect(vector[name](() => value)).toBe(value);
      });
    });


    describe(`if the callback always returns ${opposite}`, () => {
      it('should be called once', () => {
        const spy = jest.fn().mockReturnValue(opposite);
        vector[name](spy);
        expect(spy).toHaveBeenCalledTimes(1);
      });


      it(`should return false`, () => {
        expect(vector[name](() => opposite)).toBe(opposite);
      });
    });


    describe(`if the callback returns ${value} once and ${opposite} once`, () => {
      it('should return false', () => {
        const spy = jest.fn()
          .mockReturnValueOnce(value)
          .mockReturnValueOnce(opposite);

        expect(vector[name](spy)).toBe(opposite);
      });
    });
  });
}


function testImmutability(vector, operation) {
  it('should return a new vector', () => {
    const sut = operation();
    expect(sut).not.toBe(vector);
  });

  it('should not modify the original vector', () => {
    const { x, y } = vector;
    operation();
    expect(vector.x).toBe(x);
    expect(vector.y).toBe(y);
  });
}
